import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnvironmentTable1764948355300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "environment" (
                "key" character varying NOT NULL,
                "value" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_environment_key" PRIMARY KEY ("key")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "environment"`);
  }
}
