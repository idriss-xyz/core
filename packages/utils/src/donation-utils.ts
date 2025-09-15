import { Hex, parseUnits } from 'viem';

import {
  Chain,
  CHAIN_ID_TO_TOKENS,
  CREATOR_CHAIN,
  DonationData,
  IDRISS_TOKEN_ADDRESS,
  LeaderboardStats,
  TokenBalance,
} from '../../constants/src';

import { getTokenPerDollar } from './get-token-per-dollar';

export const calculateDollarsInIdrissToken = async (
  amount: number,
  chainId: number,
) => {
  const tokenAddress = IDRISS_TOKEN_ADDRESS;

  const usdcToken = CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
    return token.symbol === 'USDC';
  });

  const payload = {
    chainId: chainId,
    buyToken: tokenAddress,
    sellToken: usdcToken?.address ?? '',
    amount: 10 ** (usdcToken?.decimals ?? 0),
  };

  const tokenPerDollar = await getTokenPerDollar(payload);
  const idrissAmount = amount * Number(tokenPerDollar.price);

  return parseUnits(idrissAmount.toString(), 18);
};

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
  addressToCreatorMap?: Map<string, MappableCreator>,
): LeaderboardStats[] {
  const groupedDonations: Record<
    string,
    {
      canonicalAddress: Hex;
      totalAmount: number;
      donationCount: number;
      donorSince: number;
      displayName: string;
      avatarUrl: string;
    }
  > = {};

  for (const donation of donations) {
    const fromAddrLower = donation.fromAddress.toLowerCase();

    const donorDisplayName = donation.fromUser?.displayName ?? 'anon';
    const donorAvatarUrl = donation.fromUser?.avatarUrl ?? '';

    const creator = addressToCreatorMap?.get(fromAddrLower);

    const isRegisteredDonor = !creator && donorDisplayName !== 'anon';

    const groupKey: string = creator
      ? creator.primaryAddress.toLowerCase() // bundle all creator wallets
      : isRegisteredDonor
        ? donorDisplayName.toLowerCase() // bundle by user name
        : fromAddrLower; // anonymous → per-address

    if (!groupedDonations[groupKey]) {
      groupedDonations[groupKey] = {
        canonicalAddress: creator
          ? creator.primaryAddress
          : donation.fromAddress,
        totalAmount: 0,
        donationCount: 0,
        donorSince: donation.timestamp,
        displayName: creator
          ? creator.displayName
          : isRegisteredDonor
            ? donorDisplayName
            : 'anon',
        avatarUrl: creator
          ? (creator.profilePictureUrl ?? '')
          : isRegisteredDonor
            ? donorAvatarUrl
            : '',
      };
    }

    const group = groupedDonations[groupKey];
    group.totalAmount += donation.tradeValue;
    group.donationCount += 1;
    group.donorSince = Math.min(group.donorSince, donation.timestamp);
  }

  const leaderboard: LeaderboardStats[] = Object.values(groupedDonations).map(
    (group) => {
      return {
        address: group.canonicalAddress,
        displayName: group.displayName,
        avatarUrl: group.avatarUrl,
        totalAmount: group.totalAmount,
        donationCount: group.donationCount,
        donorSince: group.donorSince,
      };
    },
  );

  leaderboard.sort((a, b) => {
    return b.totalAmount - a.totalAmount;
  });
  return leaderboard;
}

const databaseNameToChainMap = new Map<string, Chain>();
for (const chain of Object.values(CREATOR_CHAIN)) {
  databaseNameToChainMap.set(chain.dbName, chain);
}

export function getNetworkKeyByChainId(chainId: number): string | undefined {
  const entry = Object.entries(CREATOR_CHAIN).find(([, value]) => {
    return value.id === chainId;
  });
  return entry?.[1].dbName;
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

export function calculateTokensToSend({
  isMaxAmount,
  balance,
  requestedUsdAmount,
}: {
  isMaxAmount: boolean;
  balance: TokenBalance;
  requestedUsdAmount: number;
}): bigint | null {
  if (isMaxAmount) {
    return parseUnits(balance.balance, balance.decimals);
  }

  const totalTokenBalance = parseUnits(balance.balance, balance.decimals);
  const totalUsdValue = balance.usdValue;

  const precision = 1e18;
  const scaledRequestedAmount = BigInt(
    Math.round(requestedUsdAmount * precision),
  );
  const scaledTotalUsdValue = parseUnits(totalUsdValue.toString(), 18);

  if (scaledTotalUsdValue === BigInt(0)) {
    return null;
  }

  return (totalTokenBalance * scaledRequestedAmount) / scaledTotalUsdValue;
}
