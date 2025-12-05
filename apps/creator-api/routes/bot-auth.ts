import { Router, Request, Response } from 'express';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { AppDataSource, Environment } from '@idriss-xyz/db';

const router = Router();

const TWITCH_BOT_CLIENT_ID = process.env.TWITCH_BOT_CLIENT_ID;
const TWITCH_BOT_CLIENT_SECRET = process.env.TWITCH_BOT_CLIENT_SECRET;
const TWITCH_BOT_USER_ID = process.env.TWITCH_BOT_USER_ID;
const API_CALLBACK_URI = `${CREATOR_API_URL}/bot-auth/twitch/callback`;

router.get('/twitch', (req, res) => {
  const { callback } = req.query;
  const state = callback ? encodeURIComponent(callback as string) : '';

  const authUrl = `https://id.twitch.tv/oauth2/authorize?${new URLSearchParams({
    client_id: TWITCH_BOT_CLIENT_ID!,
    redirect_uri: API_CALLBACK_URI,
    response_type: 'code',
    scope: 'user:write:chat',
    ...(state && { state }),
  })}`;

  res.redirect(authUrl);
});

router.get('/twitch/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code) {
    const finalCallbackUrl = state
      ? `${process.env.BASE_URL}/${decodeURIComponent(state as string)}`
      : `${process.env.BASE_URL}/app/setup/stream-alerts`;

    res.redirect(`${finalCallbackUrl}?success=false&error=no_code`);
    return;
  }

  try {
    const tokenResponse = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      new URLSearchParams({
        client_id: TWITCH_BOT_CLIENT_ID!,
        client_secret: TWITCH_BOT_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: API_CALLBACK_URI,
      }),
    );

    const { access_token, refresh_token } = await tokenResponse.data;

    // Validate the authenticated user matches the expected bot account
    if (TWITCH_BOT_USER_ID) {
      try {
        const userResponse = await axios.get(
          'https://api.twitch.tv/helix/users',
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Client-Id': TWITCH_BOT_CLIENT_ID!,
            },
          },
        );

        const userData = userResponse.data.data[0];
        if (userData.id !== TWITCH_BOT_USER_ID) {
          throw new Error(
            `Invalid bot account. Expected user ID: ${TWITCH_BOT_USER_ID}, got: ${userData.id}`,
          );
        }
      } catch (userError: any) {
        console.error('Bot user validation failed:', userError);
        const finalCallbackUrl = state
          ? `${process.env.BASE_URL}/${decodeURIComponent(state as string)}`
          : `${process.env.BASE_URL}/app/setup/stream-alerts`;

        res.redirect(
          `${finalCallbackUrl}?success=false&error=${encodeURIComponent(userError.message)}`,
        );
        return;
      }
    }

    // Store tokens in database
    const environmentRepository = AppDataSource.getRepository(Environment);

    await environmentRepository.upsert(
      { key: 'bot_access_token', value: access_token },
      ['key'],
    );

    await environmentRepository.upsert(
      { key: 'bot_refresh_token', value: refresh_token },
      ['key'],
    );

    res.send('Bot authorization successful! Tokens stored in database.');
  } catch (error: any) {
    console.error('Twitch bot auth failed:', error);
    const finalCallbackUrl = state
      ? `${process.env.BASE_URL}/${decodeURIComponent(state as string)}`
      : `${process.env.BASE_URL}/app/setup/stream-alerts`;

    res.redirect(
      `${finalCallbackUrl}?success=false&error=${encodeURIComponent(error.message)}`,
    );
    return;
  }
});

export default router;
