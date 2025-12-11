import { AppDataSource, Creator } from '@idriss-xyz/db';

class CreatorAuthTokenService {
  private static instance: CreatorAuthTokenService;

  private constructor() {}

  public static getInstance(): CreatorAuthTokenService {
    if (!CreatorAuthTokenService.instance) {
      CreatorAuthTokenService.instance = new CreatorAuthTokenService();
    }
    return CreatorAuthTokenService.instance;
  }

  private async validateAccessToken(
    accessToken: string,
  ): Promise<string | null> {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: { Authorization: `OAuth ${accessToken}` },
    });
    return response.ok ? ((await response.json()) as string) : null;
  }

  public async getValidAuthToken(creatorId: string): Promise<string | null> {
    const creatorRepo = AppDataSource.getRepository(Creator);
    const creator = await creatorRepo.findOne({
      where: { privyId: creatorId },
    });

    if (!creator?.twitchOauthToken) {
      return null;
    }

    // Check if token is still valid
    const isTokenValid = await this.validateAccessToken(
      creator.twitchOauthToken,
    );
    if (isTokenValid) {
      return creator.twitchOauthToken;
    }

    // Token expired, refresh it
    return this.refreshAuthToken(creator);
  }

  private async refreshAuthToken(creator: Creator): Promise<string | null> {
    if (!creator.twitchRefreshToken) {
      return null;
    }

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.TWITCH_CLIENT_ID!,
          client_secret: process.env.TWITCH_CLIENT_SECRET!,
          grant_type: 'refresh_token',
          refresh_token: creator.twitchRefreshToken,
        }),
      });

      if (!response.ok) {
        console.error(
          `Token refresh failed for creator ${creator.privyId}: ${response.status}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        access_token: string;
        refresh_token?: string;
      };

      // Update the creator with new tokens
      const creatorRepo = AppDataSource.getRepository(Creator);
      await creatorRepo.update(creator.id, {
        twitchOauthToken: data.access_token,
        twitchRefreshToken: data.refresh_token,
      });

      return data.access_token;
    } catch (error) {
      console.error(
        `Error refreshing token for creator ${creator.privyId}:`,
        error,
      );
      return null;
    }
  }
}

export const creatorAuthTokenService = CreatorAuthTokenService.getInstance();
