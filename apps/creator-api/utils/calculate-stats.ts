import { Donation } from '../db/entities/donations.entity';
import { fetchDonations } from '../db/fetch-known-donations';
import {
  TokenDisplayItem,
  DonationStats,
  TokenV2,
  LeaderboardStats,
} from '../types';
import { formatUnits } from 'viem';

export function calculateStatsForDonorAddress(
  donations: Donation[],
): DonationStats {
  let totalDonationsCount = 0;
  let totalDonationAmount = 0;
  const addressFrequency: Record<string, number> = {};
  const tokenFrequency: Record<string, number> = {};
  let biggestDonationAmount = 0;
  let mostDonatedToAddress = '';
  let favoriteDonationToken = '';
  let favoriteTokenMetadata: Omit<TokenV2, 'onchainMarketData'> | null = null;
  let donorDisplayName: string | null = null;
  let positionInLeaderboard = null;

  donations.forEach((donation) => {
    const toAddress = donation.toAddress;
    const tokenDisplayItem = donation.data.interpretation
      .descriptionDisplayItems[0] as TokenDisplayItem;

    const amountRaw = tokenDisplayItem?.amountRaw;
    const price = tokenDisplayItem?.tokenV2?.onchainMarketData?.price;
    const decimals = tokenDisplayItem?.tokenV2?.decimals ?? 18;

    if (
      amountRaw === undefined ||
      price === undefined ||
      decimals === undefined
    )
      return;

    const tradeValue =
      Number.parseFloat(formatUnits(BigInt(amountRaw), decimals)) * price;

    totalDonationAmount += tradeValue;

    addressFrequency[toAddress] = (addressFrequency[toAddress] || 0) + 1;
    if (
      addressFrequency[toAddress] >
      (addressFrequency[mostDonatedToAddress] || 0)
    ) {
      mostDonatedToAddress = toAddress;
    }

    const tokenSymbol = tokenDisplayItem.tokenV2.symbol;
    tokenFrequency[tokenSymbol] = (tokenFrequency[tokenSymbol] || 0) + 1;
    if (
      tokenFrequency[tokenSymbol] > (tokenFrequency[favoriteDonationToken] || 0)
    ) {
      favoriteDonationToken = tokenSymbol;
      favoriteTokenMetadata = {
        symbol: tokenDisplayItem.tokenV2.symbol,
        imageUrlV2: tokenDisplayItem.tokenV2.imageUrlV2,
        address: tokenDisplayItem.tokenV2.address,
        decimals: tokenDisplayItem.tokenV2.decimals,
      };
    }

    if (tradeValue > biggestDonationAmount) {
      biggestDonationAmount = tradeValue;
    }

    if (!donorDisplayName) {
      donorDisplayName = donation.data.transaction.fromUser.displayName.value;
    }
    totalDonationsCount += 1;
  });

  return {
    totalDonationsCount,
    totalDonationAmount,
    mostDonatedToAddress,
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
    ([address, donations]) => ({
      address,
      donorMetadata: donations[0].data.transaction.fromUser,
      totalAmount: donations.reduce((sum, donation) => {
        const tokenDisplayItem = donation.data.interpretation
          .descriptionDisplayItems[0] as TokenDisplayItem;

        const amountRaw = tokenDisplayItem?.amountRaw;
        const price = tokenDisplayItem?.tokenV2?.onchainMarketData?.price;
        const decimals = tokenDisplayItem?.tokenV2?.decimals ?? 18;

        if (
          amountRaw === undefined ||
          price === undefined ||
          decimals === undefined
        )
          return sum;

        const tradeValue =
          Number.parseFloat(formatUnits(BigInt(amountRaw), decimals)) * price;

        return sum + tradeValue;
      }, 0),
    }),
  );

  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard;
}
