import { AppDataSource, TwitchTokens } from '@idriss-xyz/db';

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

  public async getValidAuthToken(twitchId: string): Promise<string | null> {
    const twitchTokensRepo = AppDataSource.getRepository(TwitchTokens);
    const creatorTokens = await twitchTokensRepo.findOne({
      where: { twitchId: twitchId },
    });

    if (!creatorTokens?.accessToken) {
      return null;
    }

    // Check if token is still valid
    const isTokenValid = await this.validateAccessToken(
      creatorTokens.accessToken,
    );
    if (isTokenValid) {
      return creatorTokens.accessToken;
    }

    // Token expired, refresh it
    return this.refreshAuthToken(creatorTokens);
  }

  private async refreshAuthToken(
    twitchTokens: TwitchTokens,
  ): Promise<string | null> {
    if (!twitchTokens.refreshToken) {
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
          refresh_token: twitchTokens.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error(
          `Token refresh failed for creator ${twitchTokens.twitchId}: ${response.status}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        access_token: string;
        refresh_token?: string;
      };

      // Update the tokens
      const twitchTokensRepo = AppDataSource.getRepository(TwitchTokens);
      await twitchTokensRepo.update(twitchTokens.twitchId, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      return data.access_token;
    } catch (error) {
      console.error(
        `Error refreshing token for creator ${twitchTokens.twitchId}:`,
        error,
      );
      return null;
    }
  }
}

export const creatorAuthTokenService = CreatorAuthTokenService.getInstance();
