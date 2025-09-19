import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestructureDonations1758104996000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    /* 0 ── drop constraints that depend on token_address + old PK */
    await q.query(`
      ALTER TABLE "creator_donations"
        DROP CONSTRAINT IF EXISTS "FK_donations_to_tokens",
        DROP CONSTRAINT IF EXISTS "creator_donations_new_pkey";
    `);

    /* 1 ── add surrogate id + new PK */
    await q.query(`
      ALTER TABLE "creator_donations"
        ADD COLUMN IF NOT EXISTS "id" SERIAL,
        ADD CONSTRAINT creator_donations_pk PRIMARY KEY("id");
    `);

    /* 2. create child tables */
    await q.query(`
      CREATE TABLE IF NOT EXISTS "creator_token_donations" (
        "id"            integer  PRIMARY KEY
          REFERENCES "creator_donations"(id) ON DELETE CASCADE,
        "token_address" text     NOT NULL,
        "network"       text     NOT NULL,
        "amount_raw"    text  NOT NULL
      );
      CREATE TABLE IF NOT EXISTS "creator_nft_donations" (
        "id"                 integer PRIMARY KEY
          REFERENCES "creator_donations"(id) ON DELETE CASCADE,
        "collection_address" text   NOT NULL,
        "token_id"           bigint NOT NULL,
        "quantity"           integer NOT NULL,
        "name"               text   NOT NULL,
        "image_url"          text   NOT NULL
      );
    `);

    /* 3. migrate existing rows (all are tokens today) */
    await q.query(`
      INSERT INTO "creator_token_donations"(id, token_address, network, amount_raw)
      SELECT id, token_address, network, amount_raw
      FROM "creator_donations"
      WHERE token_address IS NOT NULL;
    `);

    /* 4. drop token-only columns from base */
    await q.query(`
      ALTER TABLE "creator_donations"
        DROP COLUMN IF EXISTS "token_address",
        DROP COLUMN IF EXISTS "amount_raw"
    `);

    /* 5. add new FK on child */
    await q.query(`
      ALTER TABLE "creator_token_donations"
        ADD CONSTRAINT fk_token_donation_token
        FOREIGN KEY (token_address, network)
        REFERENCES tokens(address, network);
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    /* a. drop new FK */
    await q.query(`
      ALTER TABLE "creator_token_donations"
        DROP CONSTRAINT IF EXISTS fk_token_donation_token;
    `);

    /* 1. restore token columns */
    await q.query(`
      ALTER TABLE "creator_donations"
        ADD COLUMN IF NOT EXISTS "token_address" text,
        ADD COLUMN IF NOT EXISTS "amount_raw"    text
    `);

    /* 2. copy back from child table */
    await q.query(`
      UPDATE "creator_donations" d
      SET token_address = t.token_address,
          amount_raw    = t.amount_raw
      FROM "creator_token_donations" t
      WHERE d.id = t.id
    `);

    /* d. restore original FK + PK, then remove surrogate id column */
    await q.query(`
      ALTER TABLE "creator_donations"
        ADD CONSTRAINT "FK_donations_to_tokens"
          FOREIGN KEY (token_address, network)
          REFERENCES tokens(address, network),
        ADD CONSTRAINT creator_donations_new_pkey1 PRIMARY KEY(transaction_hash);

      ALTER TABLE "creator_donations"
        DROP CONSTRAINT IF EXISTS creator_donations_pk,
        DROP COLUMN IF EXISTS "id";
    `);

    /* 3. drop child tables */
    await q.query(`DROP TABLE IF EXISTS "creator_nft_donations"`);
    await q.query(`DROP TABLE IF EXISTS "creator_token_donations"`);
  }
}
