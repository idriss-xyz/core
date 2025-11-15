/* eslint-disable turbo/no-undeclared-env-vars */
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

// ts-unused-exports:disable-next-line
export interface FollowedChannel {
  broadcasterId: string;
  login: string;
  name: string;
  profileImage: string;
  followers: number;
  followedAt: string;
  game: { name: string; url: string } | null;
}

// ts-unused-exports:disable-next-line
export const DEFAULT_FOLLOWED_CHANNELS: FollowedChannel[] = [
  {
    broadcasterId: '96694318',
    login: 'itokatv',
    name: 'itokatv',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/61267e76-da41-406f-bb5d-114c759661ff-profile_image-70x70.jpg',
    followers: 75_710,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '844609866',
    login: 'threadguy',
    name: 'ThreadGuy',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/36375bf2-fec0-4fb3-a5f2-02575bb63325-profile_image-70x70.png',
    followers: 30_692,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '416012132',
    login: 'andyslaps',
    name: 'AndySlaps',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/69c5e024-9287-46fa-b0c6-3dbc25ed422c-profile_image-70x70.png',
    followers: 22_836,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '46168728',
    login: 'rojankhzxr',
    name: 'Rojankhzxr',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/7787858f-9b07-4857-9cec-d64c4f341658-profile_image-70x70.png',
    followers: 199_137,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '1142457292',
    login: 'gunnygopher',
    name: 'GunnyGopher',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/955019e2-3389-4ebf-9c27-e92a1d9cbb80-profile_image-70x70.png',
    followers: 1194,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '169265076',
    login: 'stormingh',
    name: 'Stormingh',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/422b2299-3e2a-41a5-b33a-e2a8e31c7898-profile_image-70x70.png',
    followers: 30_171,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '146922206',
    login: 'imperialhal__',
    name: 'ImperialHal__',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/6d306649-dd15-4db8-82d8-655694ba692f-profile_image-70x70.png',
    followers: 2_068_159,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '233300375',
    login: 'clix',
    name: 'Clix',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/f700cd74-e74c-42a4-ba5b-18efb486eb92-profile_image-70x70.png',
    followers: 8_414_937,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '88750392',
    login: 'yagodnft',
    name: 'yagodnft',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/2135bd36-be4e-41bd-a91e-e7f2065b2f89-profile_image-70x70.png',
    followers: 1996,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '36769016',
    login: 'timthetatman',
    name: 'TimTheTatman',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/7dcd89d5-6700-4b05-b9c9-c7dac61c32db-profile_image-70x70.png',
    followers: 7_593_005,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '19571641',
    login: 'ninja',
    name: 'Ninja',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/90d40495-f467-4911-9035-72d8d10a49c5-profile_image-70x70.png',
    followers: 19_235_201,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '97599849',
    login: 'theohs_',
    name: 'TheoHS_',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/29720f1f-dc30-4bd4-96ff-864be515eeea-profile_image-70x70.jpeg',
    followers: 61_653,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '159176262',
    login: 'menyeb',
    name: 'menyeB',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/e200012e-9cb8-4eac-8fb7-3e0b736f8748-profile_image-70x70.png',
    followers: 31_527,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '555802124',
    login: 'melabeeofficial',
    name: 'MelaBeeOfficial',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/8cca933b-f92d-4673-8dc9-c77535b0c0b9-profile_image-70x70.png',
    followers: 4255,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
  {
    broadcasterId: '10815652',
    login: 'fwiz',
    name: 'Fwiz',
    profileImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/fwiz-profile_image-ef56f4c10db9e9eb-70x70.jpeg',
    followers: 80_402,
    followedAt: new Date(0).toISOString(),
    game: null,
  },
];

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
