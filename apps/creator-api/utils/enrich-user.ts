import { createPublicClient, Hex, http } from 'viem';
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
  if (userData.displayNameSource === 'ADDRESS') {
    try {
      const ensName = await publicClient.getEnsName({
        address: userData.address,
      });

      if (ensName) {
        userData.displayName = ensName;
        userData.displayNameSource = 'ENS';

        try {
          const avatarUrl = await publicClient.getEnsAvatar({ name: ensName });
          if (avatarUrl) {
            userData.avatarUrl = avatarUrl;
            userData.avatarSource = 'ENS';
          }
        } catch (error) {
          console.error('Failed to fetch ENS avatar:', error);
        }
      }
    } catch (error) {
      console.error('Failed to resolve ENS name:', error);
    }
  } else if (userData.displayNameSource === 'ENS' && userData.displayName) {
    try {
      const avatarUrl = await publicClient.getEnsAvatar({
        name: userData.displayName,
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
