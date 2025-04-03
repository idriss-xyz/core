import { createPublicClient, Hex, http } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';
import { FarcasterUserData } from '../types';

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
  console.log('enriching user: ', userData);

  if (userData.avatarSource === 'OPEPENS') {
    console.log('deleting avatar url');
    userData.avatarUrl = undefined;
  }

  if (userData.displayNameSource === 'ADDRESS') {
    console.log('is address');
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
    console.log('is ens');
    try {
      const avatarUrl = await publicClient.getEnsAvatar({
        name: normalize(userData.displayName),
      });
      console.log('Got avatar url', avatarUrl);
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
