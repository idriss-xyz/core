import { Hex } from 'viem';

import { DonationData, LeaderboardStats } from '../../constants/src';

export function calculateDonationLeaderboard(
  donations: DonationData[],
): LeaderboardStats[] {
  // Group donations by sender address
  const groupedDonations: Record<
    string,
    {
      totalAmount: number;
      donationCount: number;
      donorSince: number;
      displayName: string;
      avatarUrl: string;
    }
  > = {};

  for (const donation of donations) {
    const fromAddress = donation.fromAddress;
    // Initialize the group if it doesn't exist
    if (!groupedDonations[fromAddress]) {
      groupedDonations[fromAddress] = {
        totalAmount: 0,
        donationCount: 0,
        donorSince: donation.timestamp,
        displayName: donation.fromUser.displayName!,
        avatarUrl: donation.fromUser.avatarUrl!,
      };
    }
    groupedDonations[fromAddress].totalAmount += donation.tradeValue;
    groupedDonations[fromAddress].donationCount += 1;
    groupedDonations[fromAddress].donorSince = Math.min(
      groupedDonations[fromAddress].donorSince,
      donation.timestamp,
    );
  }

  // Create leaderboard array from grouped data
  const leaderboard: LeaderboardStats[] = Object.entries(groupedDonations).map(
    ([address, group]) => {
      return {
        address: address as Hex,
        displayName: group.displayName,
        avatarUrl: group.avatarUrl,
        totalAmount: group.totalAmount,
        donationCount: group.donationCount,
        donorSince: group.donorSince,
      };
    },
  );

  // Sort descending by donation total
  leaderboard.sort((a, b) => {
    return b.totalAmount - a.totalAmount;
  });
  return leaderboard;
}
