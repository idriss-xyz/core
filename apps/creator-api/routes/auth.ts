import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { URLSearchParams } from 'url';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

const router = Router();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
// This is the callback URL that Twitch will call on our backend
const API_CALLBACK_URI = `${CREATOR_API_URL}/auth/twitch/callback`;
// This is the callback URL on our frontend that the backend will redirect to
const FRONTEND_CALLBACK_URL = `${process.env.BASE_URL}/creators/auth/callback`;

// Step 1: Redirect user to Twitch for authorization
router.get('/twitch', (req, res) => {
  const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    redirect_uri: API_CALLBACK_URI,
    response_type: 'code',
    scope: 'user:read:email',
  })}`;
  res.redirect(authUrl);
});

// Step 2: Twitch redirects back to this backend endpoint with a code
router.get('/twitch/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Error: No code provided from Twitch.');
    return;
  }

  try {
    // Step 3: Exchange the code for a Twitch access token
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

    const { access_token } = tokenResponse.data;

    // Step 4: Use the access token to get the Twitch user's profile
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

    // Step 5: Mint our own custom JWT. This is a short-lived "ticket" for Privy.
    // The 'sub' (subject) claim MUST be the user's unique ID from the auth provider.
    const payload = {
      sub: twitchUser.id, // Twitch's unique user ID
      aud: process.env.PRIVY_APP_ID!,
    };

    const privateKey = process.env.JWT_SECRET!.replace(/\\n/g, '\n');
    const customToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });

    // Step 6: Redirect the user back to the frontend with our custom token AND the user info
    // We pass user info in the query string so the frontend can use it for new user onboarding.
    const frontendRedirectParams = new URLSearchParams({
      token: customToken,
      name: twitchUser.login,
      displayName: twitchUser.display_name,
      pfp: twitchUser.profile_image_url,
    });

    res.redirect(
      `${FRONTEND_CALLBACK_URL}?${frontendRedirectParams.toString()}`,
    );
    return;
  } catch (error) {
    console.error('Twitch auth failed:', error);
    res.status(500).send('Authentication failed.');
    return;
  }
});

export default router;
