import { CREATOR_LINKS, monthNames } from '../constants';
import {
  fetchDonations,
  fetchDonationRecipients,
} from '../db/fetch-known-donations';
import {
  DonationStats,
  LeaderboardStats,
  DonationData,
  DonationToken,
  RecipientDonationStats,
  DonationWithTimeAndAmount,
  TokenEarnings,
} from '../types';
import { Hex } from 'viem';

export function calculateDonationLeaderboard(
  donations: DonationData[],
): LeaderboardStats[] {
  // Group donations by sender address
  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const fromAddress = donation.fromAddress;
      // Initialize the group if it doesn't exist
      if (!acc[fromAddress]) {
        acc[fromAddress] = {
          totalAmount: 0,
          donorMetadata: donation.fromUser,
          displayName: donation.fromUser.displayName!,
          avatarUrl: donation.fromUser.avatarUrl!,
        };
      }
      acc[fromAddress].totalAmount += donation.tradeValue;
      return acc;
    },
    {} as Record<
      string,
      {
        totalAmount: number;
        donorMetadata: DonationData['fromUser'];
        displayName: string;
        avatarUrl: string;
      }
    >,
  );

  // Create leaderboard array from grouped data
  const leaderboard: LeaderboardStats[] = Object.entries(groupedDonations).map(
    ([address, group]) => ({
      address: address as Hex,
      donorMetadata: group.donorMetadata,
      displayName: group.displayName,
      avatarUrl: group.avatarUrl,
      totalAmount: group.totalAmount,
    }),
  );

  // Sort descending by donation total
  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);
  return leaderboard;
}

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

export async function calculateGlobalDonorLeaderboard(): Promise<
  LeaderboardStats[]
> {
  const groupedDonations = await fetchDonations();

  const leaderboard = Object.entries(groupedDonations).map(
    ([address, donations]) => {
      const hexAddress = address as Hex;
      return {
        address: hexAddress,
        donorMetadata: donations[0].fromUser,
        displayName: donations[0].fromUser.displayName!,
        avatarUrl: donations[0].fromUser.avatarUrl!,
        totalAmount: donations.reduce((sum, donation) => {
          return sum + donation.tradeValue;
        }, 0),
      };
    },
  );

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard;
}

export async function calculateGlobalStreamerLeaderboard(): Promise<
  LeaderboardStats[]
> {
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
      return {
        address: hexAddress,
        donorMetadata: donations[0].toUser,
        displayName: donations[0].toUser.displayName!,
        avatarUrl: donations[0].toUser.avatarUrl!,
        totalAmount: donations.reduce((sum, donation) => {
          return sum + donation.tradeValue;
        }, 0),
      };
    });

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

  const earningsByTokenOverview = Object.values(
    donations.reduce(
      (acc, donation) => {
        const key = donation.token.symbol;

        if (!acc[key]) {
          acc[key] = {
            tokenData: donation.token,
            totalAmount: 0,
            donationCount: 0,
          };
        }

        acc[key].totalAmount += donation.tradeValue;
        acc[key].donationCount += 1;

        return acc;
      },
      {} as Record<string, TokenEarnings>,
    ),
  );

  return {
    distinctDonorsCount,
    totalDonationsCount,
    biggestDonation,
    donationsWithTimeAndAmount,
    earningsByTokenOverview,
  };
}
