import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { calculateStatsForRecipientAddress } from '../utils/calculate-stats';
import { StoredDonationData } from '@idriss-xyz/constants';

describe('Calculate stats', () => {
  it('Calculates correct stats for recipients', () => {
    const donations = JSON.parse(
      readFileSync(resolve(__dirname, 'test-data/donation-data.json'), 'utf-8'),
    ) as StoredDonationData[];

    const result = calculateStatsForRecipientAddress(donations);

    expect(result.distinctDonorsCount).toBe(2);
    expect(result.totalDonationsCount).toBe(3);
    expect(result.biggestDonation).toBe(98.15162686310076);

    expect(result.donationsWithTimeAndAmount).toEqual([
      { year: 2025, month: 'May', amount: 67.321 },
      { year: 2025, month: 'January', amount: 95.32615170996243 },
      { year: 2025, month: 'February', amount: 98.15162686310076 },
    ]);

    expect(
      result.earningsByTokenOverview.map((r) => ({
        symbol: r.tokenData.symbol,
        totalAmount: r.totalAmount,
        donationCount: r.donationCount,
      })),
    ).toEqual([
      {
        symbol: 'ETH',
        totalAmount: 67.321,
        donationCount: 1,
      },
      {
        symbol: 'PRIME',
        totalAmount: 193.47777857306318,
        donationCount: 2,
      },
    ]);
  });
});
