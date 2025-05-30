import { Router, Request, Response } from 'express';

const router = Router();
let authToken: string | null = null;

async function fetchAuthToken(
  client_id: string,
  client_secret: string,
): Promise<string | null> {
  if (authToken) {
    return authToken;
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        grant_type: 'client_credentials',
      }),
    });
    const authToken = (await response.json()).access_token;
    return authToken;
  } catch (error) {
    console.error('Error fetching authToken:', error);
    throw error;
  }
}

async function fetchUserInfo(
  authToken: string,
  clientId: string,
  userId: string,
) {
  try {
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Client-Id': clientId,
    };
    const response = await fetch(
      `https://api.twitch.tv/helix/users?id=${userId}`,
      { headers },
    );
    return await response.json();
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

    const userInfo = await fetchUserInfo(authToken, clientId, userId);

    res.status(200).json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error fetching twitch user info', message: error });
  }
});

export default router;
