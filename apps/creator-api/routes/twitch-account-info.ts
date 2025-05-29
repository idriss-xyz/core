import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();
let authToken: string | null = null;

async function fetchAuthToken(
  clientId: string,
  client_secret: string,
): Promise<string | null> {
  if (authToken) {
    return authToken;
  }

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', {
      clientId,
      client_secret,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching authToken:', error);
    throw error;
  }
}

async function fetchUserInfo(authToken: string, userId: string) {
  try {
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID,
    };
    const response = await axios.get(
      `https://api.twitch.tv/helix/users?id=${userId}`,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching userInfo:', error);
    throw error;
  }
}

router.get('/', async (req: Request, res: Response) => {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  try {
    if (!clientId || !clientSecret) {
      res.status(401).json('Missing client ID or secret');
      return;
    }
    if (!authToken) {
      // TODO: Add contidion when authToken is expired
      authToken = await fetchAuthToken(clientId, clientSecret);
      if (!authToken) {
        res.status(401).json('Failed to fetch auth token');
        return;
      }
    }

    const userId = req.body.userId;

    if (!userId) {
      res.status(400).json('Missing user ID');
      return;
    }

    const userInfo = await fetchUserInfo(authToken, userId);

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
