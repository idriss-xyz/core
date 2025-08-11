import { MigrationInterface, QueryRunner } from 'typeorm';
import { TOKEN, CREATOR_CHAIN } from '@idriss-xyz/constants';

export class PopulateCreatorTokenAndNetworkDefaults1754915299000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tokenSymbols = Object.values(TOKEN).map((t) => t.symbol);
    const chainNames = Object.values(CREATOR_CHAIN).map((c) => c.shortName);

    /* ---------- TOKENS --------------------------------------------------- */
    const creatorsWithoutTokens: { id: number }[] = await queryRunner.query(`
      SELECT c.id
      FROM creator c
      WHERE NOT EXISTS (
        SELECT 1 FROM creator_tokens ct WHERE ct.creator_id = c.id
      )
    `);

    if (creatorsWithoutTokens.length) {
      const values = creatorsWithoutTokens
        .flatMap(({ id }) => tokenSymbols.map((sym) => `('${sym}', ${id})`))
        .join(', ');
      await queryRunner.query(`
        INSERT INTO creator_tokens ("tokenSymbol", creator_id)
        VALUES ${values};
      `);
    }

    /* ---------- NETWORKS -------------------------------------------------- */
    const creatorsWithoutNetworks: { id: number }[] = await queryRunner.query(`
      SELECT c.id
      FROM creator c
      WHERE NOT EXISTS (
        SELECT 1 FROM creator_networks cn WHERE cn.creator_id = c.id
      )
    `);

    if (creatorsWithoutNetworks.length) {
      const values = creatorsWithoutNetworks
        .flatMap(({ id }) => chainNames.map((name) => `('${name}', ${id})`))
        .join(', ');
      await queryRunner.query(`
        INSERT INTO creator_networks ("chainName", creator_id)
        VALUES ${values};
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tokenSymbols = Object.values(TOKEN).map((t) => t.symbol);
    const chainNames = Object.values(CREATOR_CHAIN).map((c) => c.shortName);

    await queryRunner.query(`
      DELETE FROM creator_tokens
      WHERE "tokenSymbol" = ANY('{${tokenSymbols.join(',')}}');
    `);

    await queryRunner.query(`
      DELETE FROM creator_networks
      WHERE "chainName" = ANY('{${chainNames.join(',')}}');
    `);
  }
}
