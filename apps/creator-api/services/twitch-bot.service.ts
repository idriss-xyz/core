import { AppDataSource, Environment } from '@idriss-xyz/db';

class TwitchBotService {
  async sendMessage(creatorTwitchId: string, message: string) {
    const accessToken = await this.getValidAccessToken();
    await fetch('https://api.twitch.tv/helix/chat/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': process.env.TWITCH_BOT_CLIENT_ID ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        broadcaster_id: creatorTwitchId,
        sender_id: process.env.TWITCH_BOT_USER_ID,
        message: message,
      }),
    });
  }

  private async getValidAccessToken(): Promise<string> {
    const environmentRepository = AppDataSource.getRepository(Environment);

    // Get current token from database
    const tokenRecord = await environmentRepository.findOne({
      where: { key: 'bot_access_token' },
    });

    if (!tokenRecord) {
      throw new Error('Bot access token not found in database');
    }

    let accessToken = tokenRecord.value;

    // Validate token
    const validateResponse = await fetch(
      'https://id.twitch.tv/oauth2/validate',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (validateResponse.status === 401) {
      // Token expired, refresh it
      accessToken = await this.refreshToken();
    }

    return accessToken;
  }
  private async refreshToken(): Promise<string> {
    const environmentRepository = AppDataSource.getRepository(Environment);

    // Get refresh token from database
    const refreshTokenRecord = await environmentRepository.findOne({
      where: { key: 'bot_refresh_token' },
    });

    if (!refreshTokenRecord) {
      throw new Error('Bot refresh token not found in database');
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_BOT_CLIENT_ID!,
        client_secret: process.env.TWITCH_BOT_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshTokenRecord.value,
      }),
    });

    const { access_token, refresh_token } = await response.json();

    // Update tokens in database
    await environmentRepository.upsert(
      { key: 'bot_access_token', value: access_token },
      ['key'],
    );

    await environmentRepository.upsert(
      { key: 'bot_refresh_token', value: refresh_token },
      ['key'],
    );

    return access_token;
  }
}

export const twitchBotService = new TwitchBotService();
