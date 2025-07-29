import { Hex } from 'viem';

import {
  Chain,
  CREATOR_CHAIN,
  DonationData,
  LeaderboardStats,
} from '../../constants/src';

export const getFilteredDonationsByPeriod = (
  donations: DonationData[],
  period?: string,
) => {
  if (!period || period === 'all') {
    return donations;
  }

  const now = Date.now();
  let startTime: number;

  if (period === '30d') {
    startTime = now - 30 * 24 * 60 * 60 * 1000;
  } else if (period === '7d') {
    startTime = now - 7 * 24 * 60 * 60 * 1000;
  } else if (/^\d+$/.test(period)) {
    const days = Number.parseInt(period, 10);
    startTime = now - days * 24 * 60 * 60 * 1000;
  } else {
    return donations;
  }

  return donations.filter((donation) => {
    return donation.timestamp >= startTime;
  });
};

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

const databaseNameToChainMap = new Map<string, Chain>();
for (const chain of Object.values(CREATOR_CHAIN)) {
  databaseNameToChainMap.set(chain.dbName, chain);
}

export function getChainByNetworkName(networkName: string): Chain | undefined {
  return databaseNameToChainMap.get(networkName);
}

export function getChainIdByNetworkName(
  networkName: string,
): number | undefined {
  return databaseNameToChainMap.get(networkName)?.id;
}

export function getChainLogoById(chainId: number): string | undefined {
  const entry = Object.values(CREATOR_CHAIN).find((chain) => {
    return chain.id === Number(chainId);
  });
  return entry?.logo;
}

interface MappableCreator {
  address: Hex;
  primaryAddress: Hex;
  displayName: string;
  profilePictureUrl?: string | null;
  associatedAddresses: { address: Hex }[];
}

export function createAddressToCreatorMap<T extends MappableCreator>(
  creators: T[],
): Map<string, T> {
  const addressToCreatorMap = new Map<string, T>();
  for (const creator of creators) {
    addressToCreatorMap.set(creator.address.toLowerCase(), creator);
    addressToCreatorMap.set(creator.primaryAddress.toLowerCase(), creator);
    for (const addr of creator.associatedAddresses) {
      addressToCreatorMap.set(addr.address.toLowerCase(), creator);
    }
  }
  return addressToCreatorMap;
}
