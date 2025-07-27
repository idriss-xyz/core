import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatorAddresses1753656919000 implements MigrationInterface {
  name = 'AddCreatorAddresses1753656919000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "creator_address" ("id" SERIAL NOT NULL, "address" text NOT NULL, "creator_id" integer, CONSTRAINT "PK_b9d5c6a4b9b8e2a3a9a8b0a3a3e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_address" ADD CONSTRAINT "FK_1e2a3b4c5d6e7f8a9b0c1d2e3f4" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator_address" DROP CONSTRAINT "FK_1e2a3b4c5d6e7f8a9b0c1d2e3f4"`,
    );
    await queryRunner.query(`DROP TABLE "creator_address"`);
  }
}
