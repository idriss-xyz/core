import { ViewEntity, ViewColumn, DataSource } from 'typeorm';

import { DonationGoal } from '../entities/donation-goal.entity';
import { Donation } from '../entities/donations.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('g.id', 'id')
      .addSelect('g.name', 'name')
      .addSelect('g.target_amount', 'targetAmount')
      .addSelect('g.start_date', 'startDate')
      .addSelect('g.end_date', 'endDate')
      .addSelect('g.active', 'active')
      // total donated so far (progress)
      .addSelect('COALESCE(SUM(d.trade_value), 0)', 'progress')
      // top donor name (display_name if available, else address)
      .addSelect(
        `(SELECT u.display_name
          FROM creator_donations du
          JOIN donation_goal_donations_creator_donations j
            ON j."creator_donations_id" = du.id
          LEFT JOIN users u
            ON u.address = du.from_address
          WHERE j."donation_goal_id" = g.id
          GROUP BY du.from_address, u.display_name
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1)`,
        'topDonorName',
      )
      // top donor total amount
      .addSelect(
        `(SELECT SUM(du.trade_value)
          FROM creator_donations du
          JOIN donation_goal_donations_creator_donations j
            ON j."creator_donations_id" = du.id
          WHERE j."donation_goal_id" = g.id
          GROUP BY du.from_address
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1)`,
        'topDonorAmount',
      )
      .from(DonationGoal, 'g')
      .leftJoin('donation_goal_donations_creator_donations', 'dg', 'dg."donation_goal_id" = g.id')
      .leftJoin(Donation, 'd', 'd.id = dg."creator_donations_id"')
      .groupBy('g.id')
      .addGroupBy('g.name')
      .addGroupBy('g.target_amount')
      .addGroupBy('g.start_date')
      .addGroupBy('g.end_date')
      .addGroupBy('g.active'),
})
export class DonationGoalView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  targetAmount!: number;

  @ViewColumn()
  startDate!: Date;

  @ViewColumn()
  endDate!: Date;

  @ViewColumn()
  active!: boolean;

  @ViewColumn()
  progress!: number;

  @ViewColumn()
  topDonorName!: string | null;

  @ViewColumn()
  topDonorAmount!: number | null;
}
