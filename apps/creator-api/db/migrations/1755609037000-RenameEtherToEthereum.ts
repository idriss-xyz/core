import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameEtherToEthereum1755609037000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE tokens
      SET name = 'Ethereum'
      WHERE name = 'Ether';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE tokens
      SET name = 'Ether'
      WHERE name = 'Ethereum';
    `);
  }
}
