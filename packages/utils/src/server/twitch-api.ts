import { DEFAULT_FOLLOWED_CHANNELS } from './constants';
import { FollowedChannel } from './interfaces';
import { twitchAuthManager } from './twitch-auth-manager';

interface TwitchUserBasic {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
}

interface TwitchUserInfo extends TwitchUserBasic {
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

async function fetchTwitchUsersBatch(
  ids: string[],
): Promise<Record<string, TwitchUserBasic>> {
  const headers = await getHeaders();

  const url = new URL(`${TWITCH_BASE_URL}/users`);
  for (const id of ids) url.searchParams.append('id', id);

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Twitch API /users error: ${response.status}`);
  }

  const json = (await response.json()) as {
    data: TwitchUserBasic[];
  };

  const map: Record<string, TwitchUserBasic> = {};

  for (const user of json.data) {
    map[user.id] = user;
  }

  return map;
}

// ts-unused-exports:disable-next-line
export async function getTwitchInfoForCreatorCreation(creatorName: string) {
  try {
    const userInfo = await fetchTwitchUserInfo(creatorName);
    if (!userInfo) {
      console.warn(`No Twitch user found for creator: ${creatorName}`);
      return null;
    }

    const followersInfo = await fetchTwitchUserFollowersCount(creatorName);

    return {
      twitchId: userInfo.id,
      username: userInfo.login,
      displayName: userInfo.display_name,
      profileImageUrl: userInfo.profile_image_url,
      description: userInfo.description,
      followerCount: followersInfo?.total ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching Twitch info for ${creatorName}:`, error);
    return null;
  }
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
      data?: TwitchUserBasic[];
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
          url: `https://static-cdn.jtvnw.net/ttv-boxart/${channel.game_id}-144x192.jpg`,
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
  limit = 10,
): Promise<FollowedChannel[]> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!clientId) throw new Error('Missing TWITCH_CLIENT_ID env var');

  const headers = {
    'Authorization': `Bearer ${userAccessToken}`,
    'Client-Id': clientId,
  };

  try {
    // get 10 most recent follows
    const url = new URL(`${TWITCH_BASE_URL}/channels/followed`);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('first', String(limit));

    const r = await fetch(url.toString(), { headers });
    if (!r.ok) throw new Error(`Twitch /channels/followed error: ${r.status}`);

    const { data: recentFollows } = (await r.json()) as {
      data: {
        broadcaster_id: string;
        broadcaster_login: string;
        broadcaster_name: string;
        followed_at: string;
      }[];
    };

    if (recentFollows.length === 0) return DEFAULT_FOLLOWED_CHANNELS;

    // batch fetch user info
    const ids = recentFollows.map((f) => {
      return f.broadcaster_id;
    });
    const userMap = await fetchTwitchUsersBatch(ids);

    const enriched: FollowedChannel[] = [];

    for (const row of recentFollows) {
      // follower count
      const followersResult = await fetch(
        `${TWITCH_BASE_URL}/channels/followers?broadcaster_id=${row.broadcaster_id}`,
        { headers },
      );

      let followerCount = 0;
      if (followersResult.ok) {
        const index = (await followersResult.json()) as { total?: number };
        followerCount = index.total ?? 0;
      }

      // current game
      let game: { name: string; url: string } | null = null;
      const channelResult = await fetch(
        `${TWITCH_BASE_URL}/channels?broadcaster_id=${row.broadcaster_id}`,
        { headers },
      );

      if (channelResult.ok) {
        const cj = (await channelResult.json()) as {
          data?: { game_id?: string; game_name?: string }[];
        };
        const c = cj.data?.[0];
        if (c?.game_id) {
          game = {
            name: c.game_name ?? '',
            url: `https://static-cdn.jtvnw.net/ttv-boxart/${c.game_id}-144x192.jpg`,
          };
        }
      }

      const user = userMap[row.broadcaster_id];

      enriched.push({
        broadcasterId: row.broadcaster_id,
        login: user?.login ?? row.broadcaster_login,
        name: user?.display_name ?? row.broadcaster_name,
        profileImage: user?.profile_image_url ?? '',
        followers: followerCount,
        followedAt: row.followed_at,
        game,
      });
    }

    return enriched;
  } catch (error) {
    console.error('Error fetching followed channels:', error);
    return DEFAULT_FOLLOWED_CHANNELS;
  }
}

// ts-unused-exports:disable-next-line
export async function getModerationStatus(
  creatorTwitchId: string,
  userAccessToken: string | null,
) {
  if (!userAccessToken) {
    console.warn(
      `No access token to fetch moderation status for twitch account ${creatorTwitchId}`,
    );
    return null;
  }
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) {
      throw new Error('Missing TWITCH_CLIENT_ID env var');
    }

    const headers = {
      'Authorization': `Bearer ${userAccessToken}`,
      'Client-Id': clientId,
    };

    const botUserId = process.env.TWITCH_BOT_USER_ID;
    if (!botUserId) {
      throw new Error('Missing TWITCH_BOT_USER_ID env var');
    }

    const response = await fetch(
      `${TWITCH_BASE_URL}/moderation/moderators?broadcaster_id=${creatorTwitchId}&user_id=${botUserId}`,
      {
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Twitch API moderation status error: ${response.statusText}`,
      );
    }
    const moderators = (await response.json()) as { data: object[] };
    const isModerator = moderators.data.length > 0;
    return isModerator;
  } catch (error) {
    console.error('Error fetching moderation status:', error);
    return null;
  }
}
