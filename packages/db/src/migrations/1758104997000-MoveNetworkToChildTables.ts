import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveNetworkToChildTables1758104997000
  implements MigrationInterface
{
  public async up(q: QueryRunner): Promise<void> {
    /* 1 ─ add network to NFT table */
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        ADD COLUMN IF NOT EXISTS "network" text
    `);

    /* 2 ─ copy network from parent into both child tables */
    await q.query(`
      UPDATE "creator_token_donations" t
      SET    network = d.network
      FROM   "creator_donations" d
      WHERE  d.id = t.id
    `);

    await q.query(`
      UPDATE "creator_nft_donations" n
      SET    network = d.network
      FROM   "creator_donations" d
      WHERE  d.id = n.id
    `);

    /* 3 ─ make nft.network NOT NULL */
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        ALTER COLUMN "network" SET NOT NULL
    `);

    /* 4 ─ remove network from parent table */
    await q.query(`
      ALTER TABLE "creator_donations"
        DROP COLUMN IF EXISTS "network"
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    /* 1 ─ re-add network to parent */
    await q.query(`
      ALTER TABLE "creator_donations"
        ADD COLUMN IF NOT EXISTS "network" text
    `);

    /* 2 ─ copy data back (token table is enough – every donation has one) */
    await q.query(`
      UPDATE "creator_donations" d
      SET    network = t.network
      FROM   "creator_token_donations" t
      WHERE  d.id = t.id
    `);

    /* 3 ─ drop network from child tables */
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        DROP COLUMN IF EXISTS "network";
      ALTER TABLE "creator_token_donations"
        DROP COLUMN IF EXISTS "network";
    `);
  }
}
