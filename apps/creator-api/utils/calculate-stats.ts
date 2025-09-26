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
import { getAddress, Hex } from 'viem';
import {
  StoredDonationData,
  DonationToken,
  LeaderboardStats,
} from '@idriss-xyz/constants';
import {
  createAddressToCreatorMap,
  getFilteredDonationsByPeriod,
} from '@idriss-xyz/utils';
import { AppDataSource } from '../db/database';
import { Creator, CreatorAddress } from '../db/entities';
import { ILike } from 'typeorm';

async function getCreatorNameOrAnon(address: string): Promise<string> {
  address = getAddress(address);
  const creatorRepository = AppDataSource.getRepository(Creator);

  // First, try to find creator by primary address
  const creatorByPrimaryAddress = await creatorRepository.findOne({
    where: { primaryAddress: address as Hex },
  });

  if (creatorByPrimaryAddress) {
    return creatorByPrimaryAddress.name;
  }

  // If not found, search in associated addresses
  const creatorByAssociatedAddress = await creatorRepository.findOne({
    where: {
      associatedAddresses: {
        address: address as Hex,
      },
    },
    relations: ['associatedAddresses'],
  });

  if (creatorByAssociatedAddress) {
    return creatorByAssociatedAddress.name;
  }

  return 'anon';
}

export async function calculateStatsForDonor(
  donations: StoredDonationData[],
  displayName?: string,
): Promise<DonationStats> {
  let totalDonationsCount = 0;
  let totalDonationAmount = 0;
  let totalNftDonationAmount = 0;
  const donationAmounts: Record<string, number> = {};
  const tokenFrequency: Record<string, number> = {};
  let biggestDonationAmount = 0;
  let mostDonatedToAddress = '0x' as Hex;
  let mostDonatedToUser: StoredDonationData['toUser'] = {
    address: '0x' as Hex,
    displayName: undefined,
    displayNameSource: undefined,
    avatarUrl: undefined,
    avatarSource: undefined,
  };
  let favoriteDonationToken = '';
  let favoriteTokenMetadata: DonationToken | null = null;
  let donorDisplayName: string | null = displayName ?? null;
  let donorAvatarUrl: string | null = null;
  let positionInLeaderboard = null;

  for (const donation of donations) {
    const toAddress = donation.toAddress;
    const tradeValue = donation.tradeValue;

    donationAmounts[toAddress] = (donationAmounts[toAddress] || 0) + tradeValue;
    if (donation.kind === 'nft') {
      totalNftDonationAmount += tradeValue;
    } else {
      totalDonationAmount += tradeValue;
    }
    if (
      donationAmounts[toAddress] > (donationAmounts[mostDonatedToAddress] || 0)
    ) {
      mostDonatedToAddress = toAddress as Hex;
      mostDonatedToUser = donation.toUser;
    }
    if (donation.kind === 'token') {
      const tokenSymbol = donation.token.symbol;
      tokenFrequency[tokenSymbol] = (tokenFrequency[tokenSymbol] || 0) + 1;
      if (
        tokenFrequency[tokenSymbol] >
        (tokenFrequency[favoriteDonationToken] || 0)
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
    }

    if (tradeValue > biggestDonationAmount) {
      biggestDonationAmount = tradeValue;
    }

    if (!donorDisplayName) {
      donorDisplayName = await getCreatorNameOrAnon(donation.fromAddress);
    }
    if (!donorAvatarUrl && donation.fromUser.avatarUrl)
      donorAvatarUrl = donation.fromUser.avatarUrl;
    totalDonationsCount += 1;
  }

  return {
    totalDonationsCount,
    totalDonationAmount,
    totalNftDonationAmount,
    mostDonatedToAddress,
    mostDonatedToUser,
    biggestDonationAmount,
    favoriteDonationToken,
    favoriteTokenMetadata,
    donorDisplayName,
    donorAvatarUrl,
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
    { creator: Creator | null; donations: StoredDonationData[] }
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

      const address = (
        creator ? creator.primaryAddress : donations[0].fromAddress
      ) as Hex;

      const displayName = creator ? creator.displayName : 'anon';

      const avatarUrl =
        creator && creator.profilePictureUrl ? creator.profilePictureUrl : '';

      return {
        address,
        displayName,
        avatarUrl,
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
  const aggregatedDonationsByCreator = new Map<number, StoredDonationData[]>();

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

/**
 * Resolve a user identifier (hex address OR displayName) to creator and all
 * its addresses (primary + associated).  If identifier is a plain address that
 * is not linked to any creator we just return that address.
 */
export async function resolveCreatorAndAddresses(
  identifier: string,
): Promise<{ creator: Creator | null; addresses: Hex[] }> {
  const creatorRepository = AppDataSource.getRepository(Creator);
  const creatorAddressRepository = AppDataSource.getRepository(CreatorAddress);

  const isAddress = identifier.toLowerCase().startsWith('0x');
  let creator: Creator | null = null;

  if (isAddress) {
    const hex = identifier as Hex;

    // primary address
    creator = await creatorRepository.findOne({
      where: { address: hex },
      relations: ['associatedAddresses'],
    });

    // secondary address
    if (!creator) {
      const secondary = await creatorAddressRepository.findOne({
        where: { address: hex },
        relations: ['creator', 'creator.associatedAddresses'],
      });
      creator = secondary?.creator ?? null;
    }
  } else {
    // resolve by displayName (case-sensitive/insensitive depending on DB collation)
    creator = await creatorRepository.findOne({
      where: { displayName: ILike(identifier) },
      relations: ['associatedAddresses'],
    });
  }

  const addresses: Hex[] = creator
    ? [creator.address, ...creator.associatedAddresses.map((a) => a.address)]
    : isAddress
      ? [identifier as Hex]
      : [];

  return { creator, addresses };
}

export function calculateStatsForRecipientAddress(
  donations: StoredDonationData[],
): RecipientDonationStats {
  const donorsAddress = donations.map((donation) =>
    donation.fromAddress.toLowerCase(),
  );
  const distinctDonorsCount = Array.from(new Set(donorsAddress)).length;
  const totalDonationsCount = donations.length;
  const biggestDonation =
    donations.length > 0 ? Math.max(...donations.map((d) => d.tradeValue)) : 0;

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
  let collectiblesEarnings: TokenEarnings | null = null;

  for (const donation of donations) {
    if (donation.kind === 'token') {
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
    } else {
      // Batch all collectibles into one synthetic bucket
      if (!collectiblesEarnings) {
        collectiblesEarnings = {
          tokenData: {
            symbol: 'NFT',
            name: 'Collectibles',
            imageUrl: '',
            decimals: 0,
            address: '' as Hex,
            network: '',
          },
          totalAmount: 0,
          donationCount: 0,
        };
      }
      collectiblesEarnings.totalAmount += donation.tradeValue;
      collectiblesEarnings.donationCount += 1;
    }
  }

  const earningsByTokenOverview = [
    ...Object.values(earningsByToken),
    ...(collectiblesEarnings ? [collectiblesEarnings] : []),
  ];

  return {
    distinctDonorsCount,
    totalDonationsCount,
    biggestDonation,
    donationsWithTimeAndAmount,
    earningsByTokenOverview,
  };
}

/**
 * For each donation:
 *   – if address belongs to a creator (primary or associated)
 *       • displayName = creator.displayName
 *       • displayNameSource = undefined
 *       • avatarUrl  = creator.profilePictureUrl (if present)
 *       • avatarSource = 'Creator'
 *   – otherwise
 *       • displayName = 'anon'
 *       • displayNameSource = undefined
 *       • avatarUrl  = ''
 *       • avatarSource = undefined
 * Address itself is NOT modified.
 */
export function enrichDonationsWithCreatorInfo(
  donations: StoredDonationData[],
  addressToCreatorMap: Map<string, Creator>,
) {
  const normalise = (addr: string) => addr.toLowerCase();

  const patch = (
    address: string,
    user: {
      displayName?: string;
      displayNameSource?: string | undefined;
      avatarUrl?: string | undefined;
      avatarSource?: string | undefined;
    },
  ) => {
    const creator = addressToCreatorMap.get(normalise(address));
    if (creator) {
      user.displayName = creator.displayName;
      user.displayNameSource = undefined;
      if (creator.profilePictureUrl) {
        user.avatarUrl = creator.profilePictureUrl;
        user.avatarSource = 'Creator';
      }
    } else {
      user.displayName = 'anon';
      user.displayNameSource = undefined;
      user.avatarUrl = '';
      user.avatarSource = undefined;
    }
  };

  for (const d of donations) {
    patch(d.fromAddress, d.fromUser);
    patch(d.toAddress, d.toUser);
  }
}
