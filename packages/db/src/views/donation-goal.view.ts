import { ViewEntity, ViewColumn, DataSource } from 'typeorm';

import { DonationGoal } from '../entities/donation-goal.entity';
import { Donation } from '../entities/donations.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .addSelect('g.id', 'id')
      .addSelect('g.name', 'name')
      .addSelect('g.target_amount', 'targetAmount')
      .addSelect('g.start_date', 'startDate')
      .addSelect('g.end_date', 'endDate')
      .addSelect('g.active', 'active')
      .addSelect('g.deleted', 'deleted')
      .addSelect('c.name', 'creatorName')
      // total donated so far (progress)
      .addSelect('COALESCE(SUM(d.trade_value), 0)', 'progress')
      .addSelect(
        `(SELECT u.display_name
          FROM creator_donations du
          LEFT JOIN users u
            ON u.address = du.from_address
          WHERE du.donation_goal_id = g.id
          GROUP BY du.from_address, u.display_name
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1)`,
        'topDonorName',
      )
      // top donor total amount
      .addSelect(
        `(SELECT SUM(du.trade_value)
          FROM creator_donations du
          WHERE du.donation_goal_id = g.id
          GROUP BY du.from_address
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1)`,
        'topDonorAmount',
      )
      .from(DonationGoal, 'g')
      .leftJoin('creator', 'c', 'c.id = g.creator_id')
      .leftJoin(
        Donation,
        'd',
        'd.donation_goal_id = g.id AND d.timestamp >= g.start_date AND d.timestamp <= g.end_date',
      )
      .groupBy('g.id')
      .addGroupBy('g.name')
      .addGroupBy('g.target_amount')
      .addGroupBy('g.start_date')
      .addGroupBy('g.end_date')
      .addGroupBy('g.active')
      .addGroupBy('g.deleted')
      .addGroupBy('c.name'),
})
export class DonationGoalView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  targetAmount!: number;

  @ViewColumn()
  startDate!: number;

  @ViewColumn()
  endDate!: number;

  @ViewColumn()
  active!: boolean;

  @ViewColumn()
  deleted!: boolean;

  @ViewColumn()
  creatorName!: string;

  @ViewColumn()
  progress!: number;

  @ViewColumn()
  topDonorName!: string | null;

  @ViewColumn()
  topDonorAmount!: number | null;
}
