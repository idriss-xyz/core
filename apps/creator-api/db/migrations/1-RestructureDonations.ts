import { MigrationInterface, QueryRunner } from 'typeorm';
import { formatUnits } from 'viem';

export class RestructureDonations implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "address" text PRIMARY KEY,
        "display_name" text,
        "display_name_source" text,
        "avatar_url" text,
        "avatar_source" text
      );

      CREATE TABLE IF NOT EXISTS "tokens" (
        "address" text NOT NULL,
        "network" text NOT NULL,
        "symbol" text NOT NULL,
        "image_url" text,
        PRIMARY KEY ("address", "network")
      );
    `);

    const oldExists = await queryRunner.hasTable('creator_donations');
    if (!oldExists) return;

    await queryRunner.query(`
      CREATE TABLE "creator_donations_new" (
        "transaction_hash" text PRIMARY KEY,
        "from_address" text NOT NULL,
        "to_address" text NOT NULL,
        "timestamp" bigint NOT NULL,
        "comment" text,
        "trade_value" decimal(36,18),
        "token_address" text NOT NULL,
        "network" text NOT NULL,
        "data" json NOT NULL,
        CONSTRAINT "fk_from_user" FOREIGN KEY ("from_address") REFERENCES "users"("address"),
        CONSTRAINT "fk_to_user" FOREIGN KEY ("to_address") REFERENCES "users"("address"),
        CONSTRAINT "fk_token" FOREIGN KEY ("token_address", "network") REFERENCES "tokens"("address", "network")
      );
    `);

    const donations = await queryRunner.query(
      `SELECT * FROM "creator_donations"`,
    );

    for (const donation of donations) {
      const data = donation.data;
      if (!data) continue;

      const fromUser = data.transaction?.fromUser;
      const toUser = data.interpretation?.descriptionDisplayItems?.[1]?.account;
      const token = data.interpretation?.descriptionDisplayItems?.[0]?.tokenV2;

      if (fromUser?.address) {
        await queryRunner.query(
          `
          INSERT INTO "users" (address, display_name, display_name_source, avatar_url, avatar_source)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (address) DO UPDATE
          SET display_name = EXCLUDED.display_name,
              display_name_source = EXCLUDED.display_name_source,
              avatar_url = EXCLUDED.avatar_url,
              avatar_source = EXCLUDED.avatar_source
        `,
          [
            fromUser.address.toLowerCase(),
            fromUser.displayName?.value,
            fromUser.displayName?.source,
            fromUser.avatar?.value?.url,
            fromUser.avatar?.source,
          ],
        );
      }

      if (toUser?.address) {
        await queryRunner.query(
          `
          INSERT INTO "users" (address, display_name, display_name_source, avatar_url, avatar_source)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (address) DO UPDATE
          SET display_name = EXCLUDED.display_name,
              display_name_source = EXCLUDED.display_name_source,
              avatar_url = EXCLUDED.avatar_url,
              avatar_source = EXCLUDED.avatar_source
        `,
          [
            toUser.address.toLowerCase(),
            toUser.displayName?.value,
            toUser.displayName?.source,
            toUser.avatar?.value?.url,
            toUser.avatar?.source,
          ],
        );
      }

      if (token?.address) {
        await queryRunner.query(
          `
          INSERT INTO "tokens" (address, symbol, image_url, network)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (address, network) DO UPDATE
          SET symbol = EXCLUDED.symbol,
              image_url = EXCLUDED.image_url
        `,
          [
            token.address.toLowerCase(),
            token.symbol,
            token.imageUrlV2,
            data.network,
          ],
        );

        const tradeValue = token.onchainMarketData?.price
          ? Number(
              formatUnits(
                BigInt(
                  data.interpretation?.descriptionDisplayItems?.[0]
                    ?.amountRaw || '0',
                ),
                token.decimals,
              ),
            ) * token.onchainMarketData.price
          : 0;

        await queryRunner.query(
          `
          INSERT INTO "creator_donations_new" (
            transaction_hash,
            from_address,
            to_address,
            timestamp,
            comment,
            trade_value,
            token_address,
            network,
            data
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (transaction_hash) DO NOTHING
        `,
          [
            donation.transaction_hash,
            fromUser?.address?.toLowerCase(),
            toUser?.address?.toLowerCase(),
            data.timestamp,
            data.interpretation?.descriptionDisplayItems?.[2]?.stringValue,
            tradeValue,
            token.address.toLowerCase(),
            data.network,
            data,
          ],
        );
      }
    }

    await queryRunner.query(`DROP TABLE "creator_donations"`);
    await queryRunner.query(
      `ALTER TABLE "creator_donations_new" RENAME TO "creator_donations"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator_donations"
      DROP CONSTRAINT IF EXISTS "fk_from_user",
      DROP CONSTRAINT IF EXISTS "fk_to_user",
      DROP CONSTRAINT IF EXISTS "fk_token"
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "creator_donations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
