import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDynamicIdToPrivyId1749000000000
  implements MigrationInterface
{
  name = 'RenameDynamicIdToPrivyId1749000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator" RENAME COLUMN "dynamic_id" TO "privy_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator" RENAME COLUMN "privy_id" TO "dynamic_id"`,
    );
  }
}
