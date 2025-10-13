import { MigrationInterface, QueryRunner } from 'typeorm';
import { CHAIN_ID_TO_TOKENS, CREATOR_CHAIN } from '@idriss-xyz/constants';

const SUPPORTED_TOKEN_SYMBOLS: string[] = [
  ...new Set(
    Object.values(CHAIN_ID_TO_TOKENS)
      .flat()
      .map((t) => {
        return t.symbol;
      }),
  ),
];

const SUPPORTED_NETWORK_NAMES: string[] = Object.values(CREATOR_CHAIN).map(
  (c) => {
    return c.shortName;
  },
);

export class CleanupUnsupportedTokensNetworks1757496093000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (SUPPORTED_TOKEN_SYMBOLS.length > 0) {
      await queryRunner.query(
        `DELETE FROM "creator_tokens"
         WHERE "tokenSymbol" NOT IN (${SUPPORTED_TOKEN_SYMBOLS.map(
           (_, index) => {
             return `$${index + 1}`;
           },
         ).join(', ')})`,
        SUPPORTED_TOKEN_SYMBOLS,
      );
    }

    // remove networks not in new allow-list
    if (SUPPORTED_NETWORK_NAMES.length > 0) {
      await queryRunner.query(
        `DELETE FROM "creator_networks"
         WHERE "chainName" NOT IN (${SUPPORTED_NETWORK_NAMES.map((_, index) => {
           return `$${index + 1}`;
         }).join(', ')})`,
        SUPPORTED_NETWORK_NAMES,
      );
    }
  }

  // Irreversible cleanup – no down migration
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
