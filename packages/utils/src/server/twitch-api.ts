/* eslint-disable turbo/no-undeclared-env-vars */
import { DEFAULT_FOLLOWED_CHANNELS } from './constants';
import { FollowedChannel } from './interfaces';
import { twitchAuthManager } from './twitch-auth-manager';

interface TwitchUserInfo {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
  game: { name: string; url: string } | null;
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
// ts-unused-exports:disable-next-line
export async function fetchTwitchUserInfo(
  name: string,
): Promise<TwitchUserInfo | null> {
  try {
    const headers = await getHeaders();

    const userResponse = await fetch(`${TWITCH_BASE_URL}/users?login=${name}`, {
      headers,
    });
    if (!userResponse.ok) {
      throw new Error(`Twitch API error: ${userResponse.status}`);
    }

    const userJson = (await userResponse.json()) as {
      data?: {
        id: string;
        login: string;
        display_name: string;
        profile_image_url: string;
        description: string;
      }[];
    };

    const user = userJson.data?.[0];
    if (!user) return null;

    let game: { name: string; url: string } | null = null;

    const channelResponse = await fetch(
      `${TWITCH_BASE_URL}/channels?broadcaster_id=${user.id}`,
      { headers },
    );

    if (channelResponse.ok) {
      const channelJson = (await channelResponse.json()) as {
        data?: { game_id?: string; game_name?: string }[];
      };

      const channel = channelJson.data?.[0];

      if (channel?.game_id) {
        game = {
          name: channel.game_name ?? '',
          url: `https://static-cdn.jtvnw.net/ttv-boxart/${channel.game_id}-285x380.jpg`,
        };
      }
    }

    return {
      id: user.id,
      login: user.login,
      display_name: user.display_name,
      profile_image_url: user.profile_image_url,
      description: user.description,
      game,
    };
  } catch (error) {
    console.error('Error fetching Twitch user info:', error);
    return null;
  }
}

// Reference: https://dev.twitch.tv/docs/api/reference/#get-stream-key
// ts-unused-exports:disable-next-line
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

    const data = (await response.json()) as { data: unknown[] };
    return { isLive: data.data.length > 0 };
  } catch (error) {
    console.error('Error fetching Twitch stream status:', error);
    return { isLive: false };
  }
}

// Reference: https://dev.twitch.tv/docs/api/reference/#get-channel-followers
// ts-unused-exports:disable-next-line
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
    return (await response.json()) as TwitchUserFollowersInfo;
  } catch (error) {
    console.error('Error fetching Twitch user info:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// user-scoped: top N channels a user follows
// Requires a USER access token that has `user:read:follows` scope
// ---------------------------------------------------------------------------
// ts-unused-exports:disable-next-line
export async function fetchUserFollowedChannels(
  userAccessToken: string,
  userId: string,
  limit = 30,
): Promise<FollowedChannel[]> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!clientId) throw new Error('Missing TWITCH_CLIENT_ID env var');

  try {
    const headers = {
      'Authorization': `Bearer ${userAccessToken}`,
      'Client-Id': clientId,
    };

    const pageSize = 100;
    const allFollows: {
      broadcaster_id: string;
      broadcaster_login: string;
      broadcaster_name: string;
      followed_at: string;
    }[] = [];

    let cursor: string | undefined;
    do {
      const url = new URL(`${TWITCH_BASE_URL}/channels/followed`);
      url.searchParams.set('user_id', userId);
      url.searchParams.set('first', String(pageSize));
      if (cursor) url.searchParams.set('after', cursor);

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`Twitch /channels/followed error: ${response.status}`);
      }

      const json = (await response.json()) as {
        data: typeof allFollows;
        pagination?: { cursor?: string };
      };

      allFollows.push(...json.data);
      cursor = json.pagination?.cursor;
    } while (cursor);

    if (allFollows.length === 0) return DEFAULT_FOLLOWED_CHANNELS;

    /* ------------ enrich each channel -------------------------------- */
    const concurrency = 10;
    const enriched: FollowedChannel[] = [];

    for (let index = 0; index < allFollows.length; index += concurrency) {
      const slice = allFollows.slice(index, index + concurrency);
      const chunk = await Promise.all(
        slice.map(async (row) => {
          const [userInfo, followersInfo] = await Promise.all([
            fetchTwitchUserInfo(row.broadcaster_login),
            fetchTwitchUserFollowersCount(row.broadcaster_login),
          ]);

          return {
            broadcasterId: row.broadcaster_id,
            login: row.broadcaster_login,
            name: row.broadcaster_name,
            profileImage: userInfo?.profile_image_url ?? '',
            followers: followersInfo?.total ?? 0,
            followedAt: row.followed_at,
            game: userInfo?.game,
          } as FollowedChannel;
        }),
      );
      enriched.push(...chunk);
    }

    /* ------------ sort by followers and return top `limit` ----------- */
    enriched.sort((a, b) => {
      return b.followers - a.followers;
    });
    return enriched.slice(0, limit);
  } catch (error) {
    console.error('Error fetching followed channels:', error);
    return DEFAULT_FOLLOWED_CHANNELS;
  }
}
