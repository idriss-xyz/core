import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { URLSearchParams } from 'url';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { AppDataSource, Creator, CreatorFollowedChannel } from '@idriss-xyz/db';
import {
  fetchUserFollowedChannels,
  FollowedChannel,
} from '@idriss-xyz/utils/server';

const router = Router();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
// This is the callback URL that Twitch will call on our backend
const API_CALLBACK_URI = `${CREATOR_API_URL}/auth/twitch/callback`;
// This is the callback URL on our frontend that the backend will redirect to
const FRONTEND_CALLBACK_URL = `${process.env.BASE_URL}`;

router.get('/twitch', (req, res) => {
  const { callback } = req.query;

  // Store the callback in the state parameter to retrieve it later
  const state = callback ? encodeURIComponent(callback as string) : '';

  const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    redirect_uri: API_CALLBACK_URI,
    response_type: 'code',
    scope: 'user:read:email user:read:follows moderation:read',
    ...(state && { state }),
  })}`;
  res.redirect(authUrl);
});

router.get('/twitch/add-moderation', (req, res) => {
  const { callback } = req.query;

  // Store the callback in the state parameter to retrieve it later
  const state = callback ? encodeURIComponent(callback as string) : '';

  const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
    client_id: TWITCH_CLIENT_ID!,
    redirect_uri: `${CREATOR_API_URL}/auth/twitch/callback`,
    response_type: 'code',
    scope: 'user:read:email user:read:follows moderation:read',
    ...(state && { state }),
  })}`;
  res.redirect(authUrl);
});

router.get('/twitch/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code) {
    res.status(400).send('Error: No code provided from Twitch.');
    return;
  }

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

    let followed: FollowedChannel[];
    try {
      followed = await fetchUserFollowedChannels(
        access_token,
        twitchUser.id,
        30,
      );
    } catch (err) {
      console.error('fetchUserFollowedChannels failed:', err);
      followed = [];
    }
    try {
      const creatorRepo = AppDataSource.getRepository(Creator);
      const followsRepo = AppDataSource.getRepository(CreatorFollowedChannel);
      const creator = await creatorRepo.findOne({
        where: { twitchId: twitchUser.id },
      });

      if (creator && followed.length) {
        // store twitch oauth token
        await creatorRepo.update(
          { twitchId: twitchUser.id },
          { twitchOauthToken: access_token, twitchRefreshToken: refresh_token },
        );

        // store follow data
        await followsRepo.delete({ creator: { id: creator.id } });
        await followsRepo.insert(
          followed.map((c) =>
            followsRepo.create({
              creator,
              channelTwitchId: c.broadcasterId,
              channelName: c.login,
              channelDisplayName: c.name,
              channelProfileImageUrl: c.profileImage,
              game: c.game,
            }),
          ),
        );
      }
    } catch (err) {
      console.error('Storing followed channels failed:', err);
    }

    const payload = {
      sub: twitchUser.id, // Twitch's unique user ID
      aud: process.env.PRIVY_APP_ID!,
    };

    const privateKey = process.env.JWT_SECRET!.replace(/\\n/g, '\n');
    const customToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });

    // Use the callback from state if provided, otherwise use default
    const finalCallbackUrl = state
      ? `${process.env.BASE_URL}/${decodeURIComponent(state as string)}`
      : FRONTEND_CALLBACK_URL;

    const frontendRedirectParams = new URLSearchParams({
      token: customToken,
      name: twitchUser.login,
      displayName: twitchUser.display_name,
      pfp: twitchUser.profile_image_url,
      email: twitchUser.email,
      callbackUrl: finalCallbackUrl,
    });

    res.redirect(`${finalCallbackUrl}?${frontendRedirectParams.toString()}`);
    return;
  } catch (error: any) {
    console.error('Twitch auth failed:', error);
    const finalCallbackUrl = state
      ? `${process.env.BASE_URL}/${decodeURIComponent(state as string)}`
      : FRONTEND_CALLBACK_URL;
    res.redirect(`${finalCallbackUrl}?error=${error.message}`);
    return;
  }
});

export default router;
