import { CREATOR_LINKS, monthNames } from '../constants';
import {
  fetchDonations,
  fetchDonationRecipients,
} from '../db/fetch-known-donations';
import {
  DonationStats,
  RecipientDonationStats,
  DonationWithTimeAndAmount,
  TokenEarnings,
} from '../types';
import { Hex } from 'viem';
import {
  DonationData,
  DonationToken,
  LeaderboardStats,
} from '@idriss-xyz/constants';
import {
  createAddressToCreatorMap,
  getFilteredDonationsByPeriod,
} from '@idriss-xyz/utils';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';

export function calculateStatsForDonorAddress(
  donations: DonationData[],
): DonationStats {
  let totalDonationsCount = 0;
  let totalDonationAmount = 0;
  const donationAmounts: Record<string, number> = {};
  const tokenFrequency: Record<string, number> = {};
  let biggestDonationAmount = 0;
  let mostDonatedToAddress = '0x' as Hex;
  let mostDonatedToUser: DonationData['toUser'] = {
    address: '0x' as Hex,
    displayName: undefined,
    displayNameSource: undefined,
    avatarUrl: undefined,
    avatarSource: undefined,
  };
  let favoriteDonationToken = '';
  let favoriteTokenMetadata: DonationToken | null = null;
  let donorDisplayName: string | null = null;
  let positionInLeaderboard = null;

  donations.forEach((donation) => {
    const toAddress = donation.toAddress;
    const tradeValue = donation.tradeValue;

    totalDonationAmount += tradeValue;
    donationAmounts[toAddress] = (donationAmounts[toAddress] || 0) + tradeValue;
    if (
      donationAmounts[toAddress] > (donationAmounts[mostDonatedToAddress] || 0)
    ) {
      mostDonatedToAddress = toAddress as Hex;
      mostDonatedToUser = donation.toUser;
    }
    const tokenSymbol = donation.token.symbol;
    tokenFrequency[tokenSymbol] = (tokenFrequency[tokenSymbol] || 0) + 1;
    if (
      tokenFrequency[tokenSymbol] > (tokenFrequency[favoriteDonationToken] || 0)
    ) {
      favoriteDonationToken = tokenSymbol;
      favoriteTokenMetadata = {
        symbol: donation.token.symbol,
        imageUrl: donation.token.imageUrl,
        address: donation.token.address,
        decimals: donation.token.decimals,
        network: donation.network,
      };
    }

    if (tradeValue > biggestDonationAmount) {
      biggestDonationAmount = tradeValue;
    }

    if (!donorDisplayName) {
      donorDisplayName = donation.fromUser.displayName ?? null;
    }
    totalDonationsCount += 1;
  });

  return {
    totalDonationsCount,
    totalDonationAmount,
    mostDonatedToAddress,
    mostDonatedToUser,
    biggestDonationAmount,
    favoriteDonationToken,
    favoriteTokenMetadata,
    donorDisplayName,
    positionInLeaderboard,
  };
}

export async function calculateGlobalDonorLeaderboard(
  period?: string,
): Promise<LeaderboardStats[]> {
  const creatorRepository = AppDataSource.getRepository(Creator);
  const creators = await creatorRepository.find({
    relations: ['associatedAddresses'],
  });
  const addressToCreatorMap = createAddressToCreatorMap(creators);

  const groupedDonations = await fetchDonations();

  const aggregatedByDonor = new Map<
    string,
    { creator: Creator | null; donations: DonationData[] }
  >();

  for (const [address, donations] of Object.entries(groupedDonations)) {
    const creator = addressToCreatorMap.get(address.toLowerCase()) ?? null;
    const key = creator ? `creator:${creator.id}` : address.toLowerCase();

    if (!aggregatedByDonor.has(key)) {
      aggregatedByDonor.set(key, { creator, donations: [] });
    }
    aggregatedByDonor.get(key)!.donations.push(...donations);
  }

  const leaderboard = Array.from(aggregatedByDonor.values())
    .map(({ creator, donations }) => {
      const firstDonationTimestamp = Math.min(
        ...donations.map((d) => d.timestamp),
      );

      const filtered = getFilteredDonationsByPeriod(donations, period);
      if (filtered.length === 0) return null;

      const totalAmount = filtered.reduce((sum, d) => sum + d.tradeValue, 0);

      return {
        address: (creator
          ? creator.primaryAddress
          : donations[0].fromAddress) as Hex,
        displayName: creator
          ? creator.displayName
          : donations[0].fromUser.displayName!,
        avatarUrl: creator
          ? creator.profilePictureUrl!
          : donations[0].fromUser.avatarUrl!,
        totalAmount,
        donationCount: filtered.length,
        donorSince: firstDonationTimestamp,
      } as LeaderboardStats;
    })
    .filter(Boolean) as LeaderboardStats[];

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard;
}

export async function calculateGlobalStreamerLeaderboard(
  period?: string,
): Promise<LeaderboardStats[]> {
  const creatorRepository = AppDataSource.getRepository(Creator);
  const creators = await creatorRepository.find({
    relations: ['associatedAddresses'],
  });
  const addressToCreatorMap = createAddressToCreatorMap(creators);

  const groupedDonationsByRecipient = await fetchDonationRecipients();
  const aggregatedDonationsByCreator = new Map<number, DonationData[]>();

  for (const [address, donations] of Object.entries(
    groupedDonationsByRecipient,
  )) {
    const creator = addressToCreatorMap.get(address.toLowerCase());
    if (creator) {
      const existingDonations =
        aggregatedDonationsByCreator.get(creator.id) || [];
      aggregatedDonationsByCreator.set(creator.id, [
        ...existingDonations,
        ...donations,
      ]);
    }
  }

  const leaderboard = Array.from(aggregatedDonationsByCreator.entries())
    .map(([creatorId, donations]) => {
      const creator = creators.find((c) => c.id === creatorId)!;
      const firstDonationTimestamp = Math.min(
        ...donations.map((d) => d.timestamp),
      );

      const filteredDonations = getFilteredDonationsByPeriod(donations, period);

      let totalAmount = 0;
      for (const donation of filteredDonations) {
        totalAmount += donation.tradeValue;
      }
      if (totalAmount === 0) return null;

      return {
        address: creator.primaryAddress,
        displayName: creator.displayName,
        avatarUrl: creator.profilePictureUrl!,
        totalAmount,
        donationCount: filteredDonations.length,
        donorSince: firstDonationTimestamp,
      };
    })
    .filter(Boolean) as LeaderboardStats[];

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard.map((entry) => ({
    ...entry,
    donateLink: CREATOR_LINKS[entry.address.toLowerCase()],
  }));
}

export function calculateStatsForRecipientAddress(
  donations: DonationData[],
): RecipientDonationStats {
  const donorsAddress = donations.map((donation) =>
    donation.fromAddress.toLowerCase(),
  );
  const distinctDonorsCount = Array.from(new Set(donorsAddress)).length;
  const totalDonationsCount = donations.length;
  const biggestDonation = Math.max(...donations.map((d) => d.tradeValue));

  const donationsWithTimeAndAmount = donations.map((donation) => {
    const timestamp = donation.timestamp;
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    const monthName = monthNames[monthIndex];
    const amount = donation.tradeValue;
    return {
      year,
      month: monthName,
      amount,
    } as DonationWithTimeAndAmount;
  });

  const earningsByToken: Record<string, TokenEarnings> = {};
  for (const donation of donations) {
    const key = donation.token.symbol;

    if (!earningsByToken[key]) {
      earningsByToken[key] = {
        tokenData: donation.token,
        totalAmount: 0,
        donationCount: 0,
      };
    }

    earningsByToken[key].totalAmount += donation.tradeValue;
    earningsByToken[key].donationCount += 1;
  }
  const earningsByTokenOverview = Object.values(earningsByToken);

  return {
    distinctDonorsCount,
    totalDonationsCount,
    biggestDonation,
    donationsWithTimeAndAmount,
    earningsByTokenOverview,
  };
}
