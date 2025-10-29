import { AppDataSource, Creator, getTokenAndNftRows } from '@idriss-xyz/db';
import { connectedClients } from './socket-server';
import { Server } from 'socket.io';
import { ILike } from 'typeorm';
import { createAddressToCreatorMap } from '@idriss-xyz/utils';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';

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
      }
    } catch (error) {
      console.error('Error handling new_donation notification:', error);
    }
  });
}
