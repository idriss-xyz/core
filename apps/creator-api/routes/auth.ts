import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import {
  AppDataSource,
  Creator,
  CreatorFollowedChannel,
  TwitchTokens,
} from '@idriss-xyz/db';
import {
  fetchUserFollowedChannels,
  FollowedChannel,
} from '@idriss-xyz/utils/server';
import { encryptionService } from '../services/encryption.service';
import { authCodeStore } from '../services/auth-code.service';
import { tightCors } from '../config/cors';

const router = Router();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

// Validate callback is a safe relative path (no open redirect)
const isValidCallback = (callback: string): boolean => {
  // Must not contain protocol or start with //
  if (/^[a-z]+:/i.test(callback) || callback.startsWith('//')) {
    return false;
  }
  // Must be a relative path starting with a safe character
  return /^[a-z0-9@]/i.test(callback);
};
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
// This is the callback URL that Twitch will call on our backend
const API_CALLBACK_URI = `${CREATOR_API_URL}/auth/twitch/callback`;
// This is the callback URL on our frontend that the backend will redirect to
const FRONTEND_CALLBACK_URL = `${process.env.BASE_URL}`;

router.get('/twitch', (req, res) => {
  const { callback } = req.query;

  // Generate CSRF nonce and store in cookie
  const csrfNonce = crypto.randomBytes(16).toString('hex');
  res.cookie('oauth_csrf', csrfNonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000, // 5 minutes
  });

  // Encode both nonce and callback in state parameter
  const stateData = JSON.stringify({
    nonce: csrfNonce,
    callback: callback || '',
  });
  const state = encodeURIComponent(stateData);

  const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    redirect_uri: API_CALLBACK_URI,
    response_type: 'code',
    scope: 'user:read:email user:read:follows moderation:read',
    state,
  })}`;
  res.redirect(authUrl);
});

router.get('/twitch/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code) {
    res.status(400).send('Error: No code provided from Twitch.');
    return;
  }

  // Parse state and verify CSRF nonce
  let stateData: { nonce?: string; callback?: string } = {};
  try {
    stateData = state ? JSON.parse(decodeURIComponent(state as string)) : {};
  } catch {
    res.status(400).send('Error: Invalid state parameter.');
    return;
  }

  const cookieNonce = req.cookies?.oauth_csrf;
  if (!cookieNonce || cookieNonce !== stateData.nonce) {
    res.status(403).send('Error: CSRF validation failed.');
    return;
  }

  // Clear the CSRF cookie
  res.clearCookie('oauth_csrf');

  try {
    const tokenResponse = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      new URLSearchParams({
        client_id: TWITCH_CLIENT_ID!,
        client_secret: TWITCH_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: API_CALLBACK_URI,
      }),
    );

    const { access_token, refresh_token } = tokenResponse.data;

    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Client-Id': TWITCH_CLIENT_ID!,
      },
    });

    const twitchUser = userResponse.data.data[0];
    if (!twitchUser) {
      throw new Error('Failed to fetch user profile from Twitch.');
    }

    // store twitch oauth token
    const twitchTokensRepo = AppDataSource.getRepository(TwitchTokens);
    await twitchTokensRepo.save({
      twitchId: twitchUser.id,
      accessToken: encryptionService.encrypt(access_token),
      refreshToken: encryptionService.encrypt(refresh_token),
    });

    const payload = {
      sub: twitchUser.id, // Twitch's unique user ID
      aud: process.env.PRIVY_APP_ID!,
    };

    const privateKey = process.env.JWT_SECRET!.replace(/\\n/g, '\n');
    const customToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });

    // Use the callback from state if provided and valid, otherwise use default
    const callbackPath = stateData.callback || null;
    const finalCallbackUrl =
      callbackPath && isValidCallback(callbackPath)
        ? `${process.env.BASE_URL}/${callbackPath}`
        : FRONTEND_CALLBACK_URL;

    // Generate a short-lived authorization code instead of passing token in URL
    const authCode = authCodeStore.generateCode({
      token: customToken,
      name: twitchUser.login,
      displayName: twitchUser.display_name,
      pfp: twitchUser.profile_image_url,
      email: twitchUser.email,
      callbackUrl: finalCallbackUrl,
    });

    const frontendRedirectParams = new URLSearchParams({
      code: authCode,
      callbackUrl: finalCallbackUrl,
    });

    res.redirect(`${finalCallbackUrl}?${frontendRedirectParams.toString()}`);
    return;
  } catch (error: any) {
    console.error('Twitch auth failed:', error);
    const errorCallbackPath = stateData.callback || null;
    const errorCallbackUrl =
      errorCallbackPath && isValidCallback(errorCallbackPath)
        ? `${process.env.BASE_URL}/${errorCallbackPath}`
        : FRONTEND_CALLBACK_URL;
    res.redirect(`${errorCallbackUrl}?error=auth_failed`);
    return;
  }
});

// Exchange authorization code for token (single-use, 60s TTL)
router.post('/token', tightCors, (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Missing or invalid authorization code' });
    return;
  }

  const data = authCodeStore.exchangeCode(code);

  if (!data) {
    res.status(400).json({ error: 'Invalid or expired authorization code' });
    return;
  }

  res.json({
    token: data.token,
    name: data.name,
    displayName: data.displayName,
    pfp: data.pfp,
    email: data.email,
    callbackUrl: data.callbackUrl,
  });
});

export default router;
