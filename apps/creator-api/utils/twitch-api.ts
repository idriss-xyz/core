import { twitchAuthManager } from '../services/twitch-auth-manager';

interface TwitchUserInfo {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

interface TwitchStreamInfo {
  isLive: boolean;
}

interface TwitchUserFollowersInfo {
  total: number;
}

const TWITCH_BASE_URL = 'https://api.twitch.tv/helix';

async function getHeaders(): Promise<Record<string, string>> {
  const authToken = await twitchAuthManager.getToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!authToken || !clientId) {
    throw new Error('Missing Twitch auth token or client ID');
  }

  return {
    'Authorization': `Bearer ${authToken}`,
    'Client-Id': clientId,
  };
}

// Reference: https://dev.twitch.tv/docs/api/reference/#get-users
export async function fetchTwitchUserInfo(
  name: string,
): Promise<TwitchUserInfo | null> {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${TWITCH_BASE_URL}/users?login=${name}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching Twitch user info:', error);
    return null;
  }
}

// Reference: https://dev.twitch.tv/docs/api/reference/#get-stream-key
export async function fetchTwitchStreamStatus(
  name: string,
): Promise<TwitchStreamInfo> {
  try {
    const headers = await getHeaders();
    const response = await fetch(
      `${TWITCH_BASE_URL}/streams?user_login=${name}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.status}`);
    }

    const data = await response.json();
    return { isLive: data.data.length > 0 };
  } catch (error) {
    console.error('Error fetching Twitch stream status:', error);
    return { isLive: false };
  }
}

// Reference: https://dev.twitch.tv/docs/api/reference/#get-channel-followers
export async function fetchTwitchUserFollowersCount(
  name: string,
): Promise<TwitchUserFollowersInfo | null> {
  try {
    const headers = await getHeaders();
    const userInfo = await fetchTwitchUserInfo(name);

    const response = await fetch(
      `${TWITCH_BASE_URL}/channels/followers?broadcaster_id=${userInfo?.id}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Twitch user info:', error);
    return null;
  }
}
