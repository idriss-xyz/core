import { MigrationInterface, QueryRunner } from 'typeorm';

// Needed to fix a manual edit on production database
export class FixCreatorAddressSequence1757432868000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // get the current highest id in creator_address
    const [{ max }] = (await queryRunner.query(
      `SELECT MAX(id) AS max FROM "creator_address";`,
    )) as Array<{ max: string | null }>;

    // if table is empty – nothing to fix
    if (max === null) {
      return;
    }

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('"creator_address"', 'id'),
        ${max}
      );
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // no-op (this is a non reversible change)
  }
}
