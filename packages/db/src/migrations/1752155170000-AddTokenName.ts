/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call */

import { MigrationInterface, QueryRunner } from 'typeorm';

// A hardcoded map of token symbols to their full names.
// Please fill this map with the symbols and names for your tokens.
const tokenNameMap: Record<string, string> = {
  WETH: 'Wrapped Ether',
  ETH: 'Ether',
  USDC: 'USDC',
  DAI: 'Dai Stablecoin',
  IDRISS: 'IDRISS',
  PRIME: 'Prime',
  GHST: 'Aavegotchi',
  POL: 'Polygon',
  DEGEN: 'Degen',
  PDT: 'Paragons DAO Token',
};

export class AddTokenName1752155170000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add the 'name' column to the 'tokens' table with a temporary default.
    await queryRunner.query(`
      ALTER TABLE "tokens"
      ADD COLUMN IF NOT EXISTS "name" character varying NOT NULL DEFAULT ''
    `);

    // Update MATIC symbol to POL before populating names
    await queryRunner.query(`
      UPDATE "tokens"
      SET symbol = 'POL'
      WHERE symbol = 'MATIC'
    `);

    // 2. Fetch all existing tokens to update their names.
    const tokens = await queryRunner.query(
      `SELECT address, symbol, network FROM "tokens"`,
    );

    // 3. Iterate over tokens and update their names based on the map.
    for (const token of tokens) {
      // Use the name from the map (case-insensitive), or fall back to the symbol if not found.
      const name = tokenNameMap[token.symbol.toUpperCase()] ?? token.symbol;

      await queryRunner.query(
        `
        UPDATE "tokens"
        SET name = $1
        WHERE address = $2 AND network = $3
      `,
        [name, token.address, token.network],
      );
    }

    // 4. Remove the temporary default value after populating the column.
    await queryRunner.query(`
      ALTER TABLE "tokens"
      ALTER COLUMN "name" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverses the migration by removing the 'name' column.
    await queryRunner.query(`
      ALTER TABLE "tokens"
      DROP COLUMN IF EXISTS "name"
    `);
  }
}
