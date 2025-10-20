import { AppDataSource, getTokenAndNftRows } from '@idriss-xyz/db';
import { connectedClients } from './socket-server';

export async function startDbListener() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(`LISTEN new_donation`);

  const pgClient = (queryRunner.connection as any).driver.master;

  pgClient.on('notification', async (msg: any) => {
    if (msg.channel !== 'new_donation' || !msg.payload) return;

    try {
      const { id } = JSON.parse(msg.payload);

      const [donation] = await getTokenAndNftRows({ id }, true);
      if (!donation) return;

      const clients = connectedClients.get(donation.toAddress.toLowerCase());
      if (clients) {
        for (const client of clients) {
          client.emit('newDonation', donation);
        }
      }
    } catch (error) {
      console.error('Error handling new_donation notification:', error);
    }
  });
}
