class TwitchAuthManager {
  private static instance: TwitchAuthManager;
  private authToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  public static getInstance(): TwitchAuthManager {
    if (!TwitchAuthManager.instance) {
      TwitchAuthManager.instance = new TwitchAuthManager();
    }
    return TwitchAuthManager.instance;
  }

  public async getToken(): Promise<string | null> {
    if (this.isTokenValid()) {
      return this.authToken;
    }

    return this.fetchNewToken();
  }

  private isTokenValid(): boolean {
    return (
      this.authToken !== null &&
      this.tokenExpiry !== null &&
      Date.now() < this.tokenExpiry
    );
  }

  // Reference: https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
  private async fetchNewToken(): Promise<string | null> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Twitch credentials');
    }

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Auth request failed: ${response.status}`);
      }

      const data = (await response.json()) as { access_token: string };
      this.authToken = data.access_token;
      this.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

      return this.authToken;
    } catch (error) {
      console.error('Error fetching Twitch auth token:', error);
      this.authToken = null;
      this.tokenExpiry = null;
      return null;
    }
  }
}

export const twitchAuthManager = TwitchAuthManager.getInstance();
