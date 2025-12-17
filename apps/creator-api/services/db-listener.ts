import { AppDataSource, Creator, getTokenAndNftRows } from '@idriss-xyz/db';
import { connectedClients } from './socket-server';
import { Server } from 'socket.io';
import { ILike } from 'typeorm';
import { createAddressToCreatorMap, formatFiatValue } from '@idriss-xyz/utils';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { twitchBotService } from './twitch-bot.service';
import { creatorAuthTokenService } from './creator-auth-token.service';
import { getModerationStatus } from '@idriss-xyz/utils/server';

// Track which creators have already received the moderation warning
const moderationWarningSent = new Map<string, boolean>();

export async function startDbListener(io: Server) {
  const creatorRepository = AppDataSource.getRepository(Creator);
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`LISTEN new_donation`);

  const pgClient = (queryRunner as any).databaseConnection;

  if (!pgClient || typeof pgClient.on !== 'function') {
    console.error('Available keys:', Object.keys(queryRunner));
    throw new Error('Could not access raw pg client for LISTEN/NOTIFY');
  }

  pgClient.on('notification', async (msg: any) => {
    if (msg.channel !== 'new_donation' || !msg.payload) return;

    try {
      const { id } = JSON.parse(msg.payload);

      const [donation] = await getTokenAndNftRows({ id }, true);
      if (!donation) return;

      const allCreators = await creatorRepository.find({
        relations: ['associatedAddresses'],
      });
      const addressToCreatorMap = createAddressToCreatorMap(allCreators);
      enrichDonationsWithCreatorInfo([donation], addressToCreatorMap);

      const creator = await creatorRepository.findOne({
        where: { primaryAddress: ILike(donation.toAddress) },
      });

      const clients = connectedClients.get(donation.toAddress.toLowerCase());
      if (clients) {
        for (const client of clients) {
          client.emit('newDonation', donation);
        }
      }

      if (creator) {
        const overlayWS = io.of('/overlay');
        const userId = creator.privyId.toLowerCase();
        overlayWS.to(userId).emit('newDonation', donation);

        // Send first message on twitch chat
        await twitchBotService.sendMessage(
          creator.twitchId,
          `<3 ${donation.fromUser.displayName ?? 'anon'} just donated ${formatFiatValue(donation.tradeValue)}`,
        );

        // Check moderation status and send appropriate follow-up message
        const authToken = await creatorAuthTokenService.getValidAuthToken(
          creator.twitchId,
        );
        console.log('authtoken: ', authToken);
        const isModerator = await getModerationStatus(creator.name, authToken);
        console.log('isModerator: ', isModerator);

        if (isModerator === false || isModerator == null) {
          // Send moderation warning only once per creator
          if (!moderationWarningSent.get(creator.twitchId)) {
            await twitchBotService.sendMessage(
              creator.twitchId,
              'To enable full chat alerts, mod this bot with: /mod idriss_xyz',
            );
            moderationWarningSent.set(creator.twitchId, true);
          }
        } else if (isModerator === true) {
          // Send support message when creator has moderated the bot
          await twitchBotService.sendMessage(
            creator.twitchId,
            `Support the stream → idriss.xyz/${donation.toUser.displayName}`,
          );
        }
      }
    } catch (error) {
      console.error('Error handling new_donation notification:', error);
    }
  });
}
