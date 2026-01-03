import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMobileSignupEmail1767350491000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "mobile_signup_email" (
        "id" SERIAL PRIMARY KEY,
        "email" text NOT NULL UNIQUE,
        "created_at" timestamp with time zone NOT NULL DEFAULT now(),
        "converted_at" timestamp with time zone NULL,
        "email_sent" boolean NOT NULL DEFAULT false,
        "email_sent_at" timestamp with time zone NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mobile_signup_email"`);
  }
}
