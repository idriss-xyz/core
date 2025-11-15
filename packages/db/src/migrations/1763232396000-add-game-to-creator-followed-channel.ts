import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGameToCreatorFollowedChannel1763232396000
  implements MigrationInterface
{
  public async up(q: QueryRunner): Promise<void> {
    await q.addColumn(
      'creator_followed_channel',
      new TableColumn({
        name: 'game',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropColumn('creator_followed_channel', 'game');
  }
}
