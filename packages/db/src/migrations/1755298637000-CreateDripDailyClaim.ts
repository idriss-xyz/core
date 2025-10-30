import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateDripDailyClaim1755298637000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'drip_daily_claim',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'creator_id', type: 'int', isNullable: false },
          { name: 'chain_id', type: 'int', isNullable: false },
          { name: 'day', type: 'date', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'drip_daily_claim',
      new TableUnique({
        name: 'uniq_creator_chain_day',
        columnNames: ['creator_id', 'chain_id', 'day'],
      }),
    );

    await queryRunner.createForeignKey(
      'drip_daily_claim',
      new TableForeignKey({
        name: 'fk_drip_claim_creator',
        columnNames: ['creator_id'],
        referencedTableName: 'creator',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'drip_daily_claim',
      'fk_drip_claim_creator',
    );
    await queryRunner.dropUniqueConstraint(
      'drip_daily_claim',
      'uniq_creator_chain_day',
    );
    await queryRunner.dropTable('drip_daily_claim');
  }
}
