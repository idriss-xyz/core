import { createPublicClient, getAddress, Hex, http } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

import {
  ActorDisplayItem,
  FarcasterUserData,
  NftCollectionDisplayItem,
  NftDisplayItem,
  StringDisplayItem,
  TokenDisplayItem,
} from './types';
import { AppDataSource } from './database';
import { Creator } from './entities';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
export async function enrichUserData(userData: {
  address: Hex;
  displayName?: string;
  displayNameSource?: string;
  avatarUrl?: string;
  avatarSource?: string;
  farcasterUserData?: FarcasterUserData;
}) {
  if (userData.avatarSource === 'OPEPENS') {
    userData.avatarUrl = undefined;
  }

  if (userData.displayNameSource === 'ADDRESS') {
    try {
      const ensName = await publicClient.getEnsName({
        address: userData.address,
      });

      if (ensName) {
        userData.displayName = ensName;
        userData.displayNameSource = 'ENS';
      }
    } catch (error) {
      console.error('Failed to resolve ENS name:', error);
    }
  }

  if (
    userData.displayName &&
    userData.displayNameSource &&
    ['ENS', 'BASENAME'].includes(userData.displayNameSource)
  ) {
    try {
      const avatarUrl = await publicClient.getEnsAvatar({
        name: normalize(userData.displayName),
      });
      if (avatarUrl) {
        userData.avatarUrl = avatarUrl;
        userData.avatarSource = 'ENS';
      }
    } catch (error) {
      console.error('Failed to fetch ENS avatar:', error);
    }
  }

  if (userData.farcasterUserData) {
    if (!userData.avatarUrl) {
      userData.avatarUrl = userData.farcasterUserData.metadata.imageUrl;
      userData.avatarSource = 'FARCASTER';
    }
    if (userData.displayNameSource === 'ADDRESS') {
      userData.displayName = userData.farcasterUserData.metadata.displayName;
      userData.displayNameSource = 'FARCASTER';
    }
  }

  return userData;
}

export const isTokenItem = (item: unknown): item is TokenDisplayItem => {
  return (
    !!item &&
    (item as { __typename?: string }).__typename === 'TokenDisplayItem'
  );
};

export const isNftItem = (item: unknown): item is NftDisplayItem => {
  return (
    !!item && (item as { __typename?: string }).__typename === 'NFTDisplayItem'
  );
};

export const isStringItem = (item: unknown): item is StringDisplayItem => {
  return (
    !!item &&
    (item as { __typename?: string }).__typename === 'StringDisplayItem'
  );
};

export const isActorItem = (item: unknown): item is ActorDisplayItem => {
  return (
    !!item &&
    (item as { __typename?: string }).__typename === 'ActorDisplayItem'
  );
};

export const isNftCollectionItem = (
  item: unknown,
): item is NftCollectionDisplayItem => {
  return (
    !!item &&
    (item as { __typename?: string }).__typename === 'NFTCollectionDisplayItem'
  );
};

export async function getCreatorNameOrAnon(address: string): Promise<string> {
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
