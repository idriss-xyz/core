import { createPublicClient, http, Hex } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { Repository } from 'typeorm';
import { User } from '@idriss-xyz/db';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function refetchEnsAvatar(
  user: User,
  userRepository: Repository<User>,
): Promise<string | undefined> {
  if (user.displayNameSource === 'ADDRESS') {
    try {
      const ensName = await publicClient.getEnsName({
        address: user.address,
      });
      if (ensName && ensName !== user.displayName) {
        user.displayName = ensName;
        user.displayNameSource = 'ENS';
      }
    } catch (error) {
      console.error('Failed to resolve ENS name:', error);
    }
  }

  if (
    !user.displayName ||
    !user.displayNameSource ||
    !['ENS', 'BASENAME'].includes(user.displayNameSource)
  ) {
    return user.avatarUrl;
  }

  try {
    const newAvatarUrl = await publicClient.getEnsAvatar({
      name: normalize(user.displayName),
    });

    if (newAvatarUrl && newAvatarUrl !== user.avatarUrl) {
      user.avatarUrl = newAvatarUrl;
      user.avatarSource = 'ENS';

      await userRepository.upsert(user, {
        conflictPaths: ['address'],
        skipUpdateIfNoValuesChanged: true,
      });

      return newAvatarUrl;
    }
  } catch (error) {
    console.error('Failed to refetch ENS avatar', error);
  }

  return user.avatarUrl;
}
