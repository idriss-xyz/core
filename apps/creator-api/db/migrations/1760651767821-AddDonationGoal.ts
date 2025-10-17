import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDonationGoal1760651767821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "donation_goal" (
          "id" SERIAL NOT NULL,
          "name" text NOT NULL,
          "target_amount" integer NOT NULL,
          "start_date" bigint NOT NULL,
          "end_date" bigint NOT NULL,
          "active" boolean NOT NULL,
          "creator_id" integer NOT NULL,
          CONSTRAINT "PK_donation_goal" PRIMARY KEY ("id"),
          CONSTRAINT "FK_donation_goal_creator" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,
    );

    await queryRunner.query(
      `CREATE TABLE "donation_goal_donations_creator_donations" (
          "donation_goal_id" integer NOT NULL,
          "creator_donations_id" integer NOT NULL,
          CONSTRAINT "PK_donation_goal_donations" PRIMARY KEY ("donation_goal_id", "creator_donations_id"),
          CONSTRAINT "FK_donation_goal" FOREIGN KEY ("donation_goal_id") REFERENCES "donation_goal"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_creator_donations" FOREIGN KEY ("creator_donations_id") REFERENCES "creator_donations"("id") ON DELETE CASCADE
        )`,
    );

    await queryRunner.query(`
        CREATE OR REPLACE VIEW donation_goal_view AS
        SELECT
          g.id AS id,
          g.name AS name,
          g.target_amount AS "targetAmount",
          g.start_date AS "startDate",
          g.end_date AS "endDate",
          g.active AS active,
          c.name AS "creatorName",
          COALESCE(SUM(d.trade_value), 0) AS progress,
          (
            SELECT u.display_name
            FROM creator_donations du
            JOIN donation_goal_donations_creator_donations j
              ON j."creator_donations_id" = du.id
            LEFT JOIN users u
              ON u.address = du.from_address
            WHERE j."donation_goal_id" = g.id
              AND du.timestamp >= g.start_date
              AND du.timestamp <= g.end_date
            GROUP BY du.from_address, u.display_name
            ORDER BY SUM(du.trade_value) DESC
            LIMIT 1
          ) AS "topDonorName",
          (
            SELECT SUM(du.trade_value)
            FROM creator_donations du
            JOIN donation_goal_donations_creator_donations j
              ON j."creator_donations_id" = du.id
            WHERE j."donation_goal_id" = g.id
              AND du.timestamp >= g.start_date
              AND du.timestamp <= g.end_date
            GROUP BY du.from_address
            ORDER BY SUM(du.trade_value) DESC
            LIMIT 1
          ) AS "topDonorAmount"
        FROM donation_goal g
        LEFT JOIN creator c ON c.id = g.creator_id
        LEFT JOIN donation_goal_donations_creator_donations dg
          ON dg."donation_goal_id" = g.id
        LEFT JOIN creator_donations d
          ON d.id = dg."creator_donations_id" AND d.timestamp >= g.start_date AND d.timestamp <= g.end_date
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
    await queryRunner.query(
      `DROP TABLE "donation_goal_donations_creator_donations"`,
    );
    await queryRunner.query(`DROP TABLE "donation_goal"`);
    await queryRunner.query(`DROP VIEW "donation_goal_view"`);
  }
}
