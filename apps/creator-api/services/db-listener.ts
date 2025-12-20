import { AppDataSource, Creator, getTokenAndNftRows } from '@idriss-xyz/db';
import { connectedClients } from './socket-server';
import { Server } from 'socket.io';
import { ILike } from 'typeorm';
import { createAddressToCreatorMap, formatFiatValue } from '@idriss-xyz/utils';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { twitchBotService } from './twitch-bot.service';
import { toUnicodeItalic } from '../utils/font-utils';
import { getModerationStatus } from '@idriss-xyz/utils/server';
import { creatorAuthTokenService } from './creator-auth-token.service';

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

        const assetValue =
          donation.kind === 'nft'
            ? donation.name
            : formatFiatValue(donation.tradeValue);

        // Check moderation status and send appropriate follow-up message
        const authToken = await creatorAuthTokenService.getValidAuthToken(
          creator.twitchId,
        );
        const isModerator = await getModerationStatus(creator.name, authToken);

        const renderedMessage = `${
          donation.fromUser.displayName
            ? `@${donation.fromUser.displayName}`
            : 'anon'
        } just donated ${assetValue}${
          donation.comment
            ? ` with a message: ${toUnicodeItalic(donation.comment)}.`
            : '.'
        } ${isModerator ? `Support the stream → idriss.xyz/${donation.toUser.displayName} <3` : ''}`;

        await twitchBotService.sendMessage(creator.twitchId, renderedMessage);
      }
    } catch (error) {
      console.error('Error handling new_donation notification:', error);
    }
  });
}
