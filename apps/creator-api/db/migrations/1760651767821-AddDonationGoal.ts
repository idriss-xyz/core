import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddDonationGoal1760651767821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the donation_goal table
    await queryRunner.query(
      `CREATE TABLE "donation_goal" (
          "id" SERIAL NOT NULL,
          "name" text NOT NULL,
          "target_amount" integer NOT NULL,
          "start_date" bigint NOT NULL,
          "end_date" bigint NOT NULL,
          "active" boolean NOT NULL DEFAULT false,
          "deleted" boolean NOT NULL DEFAULT false,
          "creator_id" integer NOT NULL,
          CONSTRAINT "PK_donation_goal" PRIMARY KEY ("id"),
          CONSTRAINT "FK_donation_goal_creator" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,
    );

    // Add donation_goal_id column to creator_donations table
    await queryRunner.addColumn(
      'creator_donations',
      new TableColumn({
        name: 'donation_goal_id',
        type: 'int',
        isNullable: true,
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'creator_donations',
      new TableForeignKey({
        columnNames: ['donation_goal_id'],
        referencedTableName: 'donation_goal',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL', // If a donation goal is deleted, the donation remains but loses association
      }),
    );

    // Create a database function and trigger for automatically associating new donations with goals
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION associate_donation_with_goal()
      RETURNS TRIGGER AS $$
      BEGIN
        RAISE NOTICE 'NEW donation record: id=%, to_address=%, from_address=%, timestamp=%, trade_value=%',
          NEW.id, NEW.to_address, NEW.from_address, NEW.timestamp, NEW.trade_value;

        SELECT dg.id INTO NEW.donation_goal_id
        FROM donation_goal dg
        JOIN creator c ON c.id = dg.creator_id
        WHERE LOWER(NEW.to_address) = LOWER(c.address)
          AND dg.active = true
          AND NEW.timestamp >= dg.start_date
          AND NEW.timestamp <= dg.end_date
        LIMIT 1;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER donation_goal_association_trigger
      BEFORE INSERT ON creator_donations
      FOR EACH ROW
      EXECUTE FUNCTION associate_donation_with_goal();
    `);

    // Create the donation_goal_view
    await queryRunner.query(`
      CREATE OR REPLACE VIEW donation_goal_view AS
      SELECT
        g.id AS id,
        g.name AS name,
        g.target_amount AS "targetAmount",
        g.start_date AS "startDate",
        g.end_date AS "endDate",
        g.active AS active,
        g.deleted AS deleted,
        c.name AS "creatorName",
        COALESCE(SUM(d.trade_value), 0) AS progress,
        (
          SELECT u.display_name
          FROM creator_donations du
          LEFT JOIN users u
            ON LOWER(u.address) = LOWER(du.from_address)
          WHERE du.donation_goal_id = g.id
            AND du.timestamp >= g.start_date
            AND du.timestamp <= g.end_date
          GROUP BY du.from_address, u.display_name
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorName",
        (
          SELECT SUM(du.trade_value)
          FROM creator_donations du
          WHERE du.donation_goal_id = g.id
            AND du.timestamp >= g.start_date
            AND du.timestamp <= g.end_date
          GROUP BY du.from_address
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorAmount"
      FROM donation_goal g
      LEFT JOIN creator c ON c.id = g.creator_id
      LEFT JOIN creator_donations d
        ON d.donation_goal_id = g.id AND d.timestamp >= g.start_date AND d.timestamp <= g.end_date
      GROUP BY
        g.id,
        g.name,
        g.target_amount,
        g.start_date,
        g.end_date,
        g.active,
        c.name;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the view
    await queryRunner.query(`DROP VIEW IF EXISTS "donation_goal_view"`);

    // Remove trigger and function
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS donation_goal_association_trigger ON creator_donations;
      DROP FUNCTION IF EXISTS associate_donation_with_goal();
    `);

    // Remove foreign key and column
    const table = await queryRunner.getTable('creator_donations');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('donation_goal_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('creator_donations', foreignKey);
    }

    await queryRunner.dropColumn('creator_donations', 'donation_goal_id');

    // Drop the donation_goal table
    await queryRunner.query(`DROP TABLE IF EXISTS "donation_goal"`);
  }
}
