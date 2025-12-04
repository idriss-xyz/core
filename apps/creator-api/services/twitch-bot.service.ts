import tmi from 'tmi.js';

export class TwitchBotService {
  async sendMessage(creatorName: string, botToken: string, message: string) {
    const client = new tmi.Client({
      identity: {
        username: 'idriss_bot',
        password: `oauth:${botToken}`,
      },
      channels: [creatorName],
    });

    // TODO: not sure if we should keep connection alive or kill it on each message
    // i.e. call initClient once and then
    await client.connect();
    await client.say(creatorName, message);
    await client.disconnect();
  }
}

export const twitchBotService = new TwitchBotService();
