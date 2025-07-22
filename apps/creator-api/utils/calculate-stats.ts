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
import { getFilteredDonationsByPeriod } from '@idriss-xyz/utils';

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
  const groupedDonations = await fetchDonations();

  const leaderboard = Object.entries(groupedDonations)
    .map(([address, donations]) => {
      const hexAddress = address as Hex;
      const firstDonationTimestamp = Math.min(
        ...donations.map((d) => d.timestamp),
      );

      const filteredDonations = getFilteredDonationsByPeriod(donations, period);

      if (filteredDonations.length === 0) {
        return null;
      }

      let totalAmount = 0;
      for (const donation of filteredDonations) {
        totalAmount += donation.tradeValue;
      }
      return {
        address: hexAddress,
        displayName: donations[0].fromUser.displayName!,
        avatarUrl: donations[0].fromUser.avatarUrl!,
        totalAmount,
        donationCount: filteredDonations.length,
        donorSince: firstDonationTimestamp,
      };
    })
    .filter(Boolean) as LeaderboardStats[];

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard;
}

export async function calculateGlobalStreamerLeaderboard(
  period?: string,
): Promise<LeaderboardStats[]> {
  const groupedDonations = await fetchDonationRecipients();

  const leaderboard = Object.entries(groupedDonations)
    .filter(([address, donations]) => {
      const toUser = donations[0].toUser;
      return (
        toUser &&
        toUser.address &&
        /^0x[a-fA-F0-9]{40}$/.test(toUser.address) &&
        toUser.displayName &&
        toUser.displayNameSource &&
        toUser.avatarUrl !== undefined
      );
    })
    .map(([address, donations]) => {
      const hexAddress = address as Hex;
      const firstDonationTimestamp = Math.min(
        ...donations.map((d) => d.timestamp),
      );

      const filteredDonations = getFilteredDonationsByPeriod(donations, period);

      if (filteredDonations.length === 0) {
        return null;
      }

      let totalAmount = 0;
      for (const donation of filteredDonations) {
        totalAmount += donation.tradeValue;
      }
      return {
        address: hexAddress,
        displayName: donations[0].toUser.displayName!,
        avatarUrl: donations[0].toUser.avatarUrl!,
        totalAmount,
        donationCount: filteredDonations.length,
        donorSince: firstDonationTimestamp,
      };
    })
    .filter(Boolean) as LeaderboardStats[];

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  // Enrich leaderboard with hardcoded links
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
