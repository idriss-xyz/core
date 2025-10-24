import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDynamicId1748284091728 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creator" ADD COLUMN "dynamic_id" text UNIQUE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "creator" DROP COLUMN "dynamic_id"`);
  }
}
