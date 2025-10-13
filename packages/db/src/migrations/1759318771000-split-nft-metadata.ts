import { MigrationInterface, QueryRunner } from 'typeorm';
import { CHAIN_ID_TO_NFT_COLLECTIONS } from '@idriss-xyz/constants';
import { getChainByNetworkName } from '@idriss-xyz/utils';

export class SplitNftMetadata1759318771000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    /* ─ 0. prepare creator_nft_donations table ───────────────────────────── */
    await q.query(
      `ALTER TABLE "creator_nft_donations" ADD COLUMN "nft_token_id" integer;`,
    );

    /* ─ 1. create new tables (same NOT-NULL spec you have) ───────────────── */
    await q.query(`
      CREATE TABLE "nft_collections" (
        "address"     text NOT NULL,
        "network"     text NOT NULL,
        "name"        text NOT NULL,
        "short_name"  text NOT NULL,
        "image_url"   text NOT NULL,
        "slug"        text NOT NULL,
        "category"    text NOT NULL,
        PRIMARY KEY ("address","network")
      );
    `);

    await q.query(`
      CREATE TABLE "nft_tokens" (
        "id" SERIAL PRIMARY KEY,
        "collection_address" text NOT NULL,
        "network" text NOT NULL,
        "token_id" bigint NOT NULL,
        "name" text NOT NULL,
        "img_small" text,
        "img_medium" text,
        "img_large" text,
        "img_preferred" text,
        CONSTRAINT "fk_nft_collection"
          FOREIGN KEY ("collection_address","network")
          REFERENCES "nft_collections"("address","network")
          ON DELETE CASCADE,
        CONSTRAINT "uq_nft_token"
          UNIQUE ("collection_address","network","token_id")
      );
    `);

    /* ─ 2. read distinct legacy NFT-donation rows ────────────────────────── */
    const legacyRows: {
      collection_address: string;
      network: string;
      token_id: string;
      name: string | null;
      image_url: string | null;
    }[] = await q.query(`
        SELECT DISTINCT
          collection_address,
          network,
          token_id,
          name,
          image_url
        FROM "creator_nft_donations"
        WHERE collection_address IS NOT NULL
    `);

    /* ─ 3. upsert collections & tokens using the constants map ------------- */
    for (const row of legacyRows) {
      const chain = getChainByNetworkName(row.network);
      const meta =
        chain &&
        CHAIN_ID_TO_NFT_COLLECTIONS[chain.id]?.find((c) => {
          return (
            c.address.toLowerCase() === row.collection_address.toLowerCase()
          );
        });

      const slug = meta?.slug ?? '';
      const shortName = meta?.shortName ?? '';
      const category = meta?.category ?? '';
      const collName = meta?.name ?? '';
      const image = row.image_url ?? '';

      /* collection */
      await q.query(
        `INSERT INTO "nft_collections"
           ("address","network","name","short_name","image_url","slug","category")
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT ("address","network") DO NOTHING`,
        [
          row.collection_address.toLowerCase(),
          row.network,
          collName,
          shortName,
          image,
          slug,
          category,
        ],
      );

      /* token */
      await q.query(
        `INSERT INTO "nft_tokens"
           ("collection_address","network","token_id","name",
            "img_small","img_medium","img_large")
         VALUES ($1,$2,$3,$4,$5,$5,$5)
         ON CONFLICT ("collection_address","network","token_id") DO NOTHING`,
        [
          row.collection_address.toLowerCase(),
          row.network,
          row.token_id,
          row.name,
          image,
        ],
      );
    }

    /* ─ 4. back-fill nft_token_id for each donation row -------------------- */
    await q.query(`
      UPDATE "creator_nft_donations" d
      SET    "nft_token_id" = nt.id
      FROM   "nft_tokens" nt
      WHERE  nt.collection_address = d.collection_address
        AND  nt.network            = d.network
        AND  nt.token_id::text     = d.token_id::text;
    `);

    /* ─ 5. enforce NOT-NULL + FK, then drop obsolete cols ------------------ */
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        ALTER COLUMN "nft_token_id" SET NOT NULL,
        ADD CONSTRAINT "fk_donation_nft_token"
          FOREIGN KEY ("nft_token_id")
          REFERENCES "nft_tokens"("id")
          ON DELETE CASCADE;
    `);

    await q.query(`
      ALTER TABLE "creator_nft_donations"
        DROP COLUMN "collection_address",
        DROP COLUMN "network",
        DROP COLUMN "token_id",
        DROP COLUMN "name",
        DROP COLUMN "image_url";
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    // 1. add back old columns
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        ADD COLUMN "collection_address" text,
        ADD COLUMN "network" text,
        ADD COLUMN "token_id" text,
        ADD COLUMN "name" text,
        ADD COLUMN "image_url" text;
    `);

    // 2. repopulate data from nft_tokens + nft_collections
    await q.query(`
      UPDATE "creator_nft_donations" d
      SET
        collection_address = nt.collection_address,
        network            = nt.network,
        token_id           = nt.token_id::text,
        name               = nt.name,
        image_url          = COALESCE(nt.img_preferred, nt.img_large, nt.img_medium, nt.img_small, nc.image_url)
      FROM nft_tokens nt
      JOIN nft_collections nc
        ON nc.address = nt.collection_address
       AND nc.network = nt.network
      WHERE d.nft_token_id = nt.id;
    `);

    // 3. remove FK + nft_token_id
    await q.query(`
      ALTER TABLE "creator_nft_donations"
        DROP CONSTRAINT "fk_donation_nft_token",
        DROP COLUMN "nft_token_id";
    `);

    // 4. drop new tables
    await q.query(`DROP TABLE "nft_tokens";`);
    await q.query(`DROP TABLE "nft_collections";`);
  }
}
