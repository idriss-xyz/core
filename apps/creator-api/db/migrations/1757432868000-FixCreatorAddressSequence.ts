import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCreatorAddressSequence1757432868000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('"creator_address"', 'id'),
        COALESCE((SELECT MAX(id) FROM "creator_address"), 0)
      );
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op
  }
}
