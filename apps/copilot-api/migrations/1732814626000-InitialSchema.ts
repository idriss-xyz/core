import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1732814626000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE webhooks (
        internal_id uuid PRIMARY KEY,
        webhook_id text NOT NULL,
        signing_key text NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE subscribers (
        subscriber_id text PRIMARY KEY
      )
    `);

    await queryRunner.query(`
      CREATE TABLE addresses (
        address text PRIMARY KEY,
        user uuid REFERENCES users(uuid)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE subscriptions (
        subscriber_id text REFERENCES subscribers(subscriber_id),
        address text REFERENCES addresses(address),
        PRIMARY KEY (subscriber_id, address)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE address_webhook_map (
        address text PRIMARY KEY REFERENCES addresses(address),
        webhook_internal_id uuid REFERENCES webhooks(internal_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS address_webhook_map`);
    await queryRunner.query(`DROP TABLE IF EXISTS subscriptions`);
    await queryRunner.query(`DROP TABLE IF EXISTS addresses`);
    await queryRunner.query(`DROP TABLE IF EXISTS subscribers`);
    await queryRunner.query(`DROP TABLE IF EXISTS webhooks`);
  }

}

