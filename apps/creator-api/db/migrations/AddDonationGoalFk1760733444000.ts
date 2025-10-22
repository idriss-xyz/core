import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddDonationGoalFk1760733444000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // Drop the join table since we're moving to a direct foreign key approach
    await queryRunner.query(`
      DROP TABLE IF EXISTS donation_goal_donations_creator_donations
    `);

    // Create a database function and trigger for automatically associating new donations with goals
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION associate_donation_with_goal()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Find the active donation goal for this creator at the time of donation
        UPDATE creator_donations
        SET donation_goal_id = (
          SELECT dg.id
          FROM donation_goal dg
          JOIN creator c ON c.id = dg.creator_id
          JOIN creator_address ca ON ca.creator_id = c.id
          WHERE NEW.to_address = ca.address
            AND dg.active = true
            AND NEW.timestamp >= dg.start_date
            AND NEW.timestamp <= dg.end_date
          LIMIT 1
        )
        WHERE id = NEW.id;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS donation_goal_association_trigger ON creator_donations;

      CREATE TRIGGER donation_goal_association_trigger
      AFTER INSERT ON creator_donations
      FOR EACH ROW
      EXECUTE FUNCTION associate_donation_with_goal();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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

    // Recreate the join table
    await queryRunner.query(`
      CREATE TABLE donation_goal_donations_creator_donations (
        "donation_goal_id" integer NOT NULL,
        "creator_donations_id" integer NOT NULL,
        CONSTRAINT "PK_donation_goal_donations" PRIMARY KEY ("donation_goal_id", "creator_donations_id"),
        CONSTRAINT "FK_donation_goal" FOREIGN KEY ("donation_goal_id") REFERENCES "donation_goal" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_creator_donations" FOREIGN KEY ("creator_donations_id") REFERENCES "creator_donations" ("id") ON DELETE CASCADE
      )
    `);
  }
}
