/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call */
import { MigrationInterface, QueryRunner } from 'typeorm';
import { formatUnits, createPublicClient, http } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

export class RestructureDonations1743174000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const userLatestData = new Map<
      string,
      {
        displayName?: string;
        displayNameSource?: string;
        avatarUrl?: string;
        avatarSource?: string;
        timestamp: number;
      }
    >();
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
      `SELECT * FROM "creator_donations" ORDER BY data->>'timestamp' DESC`,
    );

    const processUser = async (user: any, timestamp: number) => {
      if (!user?.address) return;

      const address = user.address.toLowerCase();

      // Only update if this is the most recent transaction for this user
      const existing = userLatestData.get(address);
      if (existing && existing.timestamp > timestamp) return;

      let displayName = user.displayName?.value;
      let displayNameSource = user.displayName?.source;
      let avatarUrl = user.avatar?.value?.url;
      let avatarSource = user.avatar?.source;

      if (avatarSource === 'OPEPENS') {
        avatarUrl = undefined;
      }

      // If display name source is 'ADDRESS', try ENS resolution
      if (displayNameSource === 'ADDRESS') {
        try {
          const ensName = await client.getEnsName({
            address: address as `0x${string}`,
          });

          if (ensName) {
            displayName = ensName;
            displayNameSource = 'ENS';
          }
        } catch (error) {
          console.error(`ENS resolution failed for ${address}:`, error);
        }
      }
      if (displayNameSource === 'ENS' || displayNameSource === 'BASENAME') {
        // Try to get ENS avatar
        const avatarUri = await client.getEnsAvatar({
          name: normalize(displayName),
        });
        if (avatarUri) {
          avatarUrl = avatarUri;
          avatarSource = 'ENS';
        }
      }

      userLatestData.set(address, {
        displayName,
        displayNameSource,
        avatarUrl,
        avatarSource,
        timestamp,
      });
    };

    // First pass: Process all users
    for (const donation of donations) {
      const data = donation.data;
      if (!data) continue;

      const fromUser = data.transaction?.fromUser;
      const toUser = data.interpretation?.descriptionDisplayItems?.[1]?.account;

      await processUser(fromUser, data.timestamp);
      await processUser(toUser, data.timestamp);
    }

    // Insert all users before handling donations
    for (const [address, userData] of userLatestData.entries()) {
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
          address,
          userData.displayName,
          userData.displayNameSource,
          userData.avatarUrl,
          userData.avatarSource,
        ],
      );
    }

    // Second pass: Process tokens and donations
    for (const donation of donations) {
      const data = donation.data;
      if (!data) continue;

      const fromUser = data.transaction?.fromUser;
      const toUser = data.interpretation?.descriptionDisplayItems?.[1]?.account;
      const token = data.interpretation?.descriptionDisplayItems?.[0]?.tokenV2;

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

    await queryRunner.query(`DROP TABLE IF EXISTS "tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
