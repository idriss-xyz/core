import { createPublicClient, Hex, http } from 'viem';
import { normalize } from 'viem/ens';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function enrichUserWithEns(userData: {
  address: Hex;
  displayName?: string;
  displayNameSource?: string;
  avatarUrl?: string;
  avatarSource?: string;
}) {
  if (userData.avatarSource && userData.avatarSource === 'OPEPENS') {
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

  if (userData.displayName && userData.displayNameSource === 'ENS') {
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

  return userData;
}
