import { getAddress, Hex } from 'viem';
import { CHAIN, CREATOR_API_URL, NFT_ABI } from '@idriss-xyz/constants';
import { clients } from '@idriss-xyz/blockchain-clients';

import { CreatorProfileResponse } from './types';

type BrowserBasedImageProperties = {
  svgSrc: string;
  pngSrc: string;
};

const isAppleBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;

  return (
    /Macintosh|iPhone|iPad|iPod/.test(ua) &&
    ua.includes('Safari') &&
    !/Chrome|CriOS|FxiOS/.test(ua)
  );
};

export const browserBasedSource = ({
  svgSrc,
  pngSrc,
}: BrowserBasedImageProperties) => {
  if (isAppleBrowser()) {
    return pngSrc;
  }

  return svgSrc;
};

export const getChainShortNamesFromIds = (chainsIds: number[]) => {
  return (
    chainsIds
      //eslint-disable-next-line unicorn/no-array-reduce
      .reduce((previous, chainId) => {
        return [
          ...previous,
          Object.values(CHAIN).find((chain) => {
            return chain.id === chainId;
          })?.shortName ?? '',
        ];
      }, [] as string[])
      .filter(Boolean)
  );
};

export const getChainIdsFromShortNames = (shortNames: string[]) => {
  return shortNames.map((shortName) => {
    return (
      Object.values(CHAIN).find((chain) => {
        return chain.shortName === shortName;
      })?.id ?? 0
    );
  });
};

export const getCreatorNameAndPicOrAnon = async (
  address: string,
): Promise<{ profilePicUrl: string | undefined; name: string }> => {
  const formattedAddress = getAddress(address);
  try {
    const response = await fetch(
      `${CREATOR_API_URL}/creator-profile/address/${formattedAddress}`,
    );
    if (response.ok) {
      const profile = (await response.json()) as CreatorProfileResponse;
      return {
        profilePicUrl: profile.profilePictureUrl ?? undefined,
        name: profile.name ?? 'anon',
      };
    }
    return { profilePicUrl: undefined, name: 'anon' };
  } catch (error) {
    console.error('Error fetching creator profile by address.', error);
    return { profilePicUrl: undefined, name: 'anon' };
  }
};

export async function getNftMetadata(
  client: (typeof clients)[number]['client'],
  contract: Hex,
  id: bigint,
  assetType: number,
) {
  let collectionName: string | undefined;
  try {
    collectionName = await client.readContract({
      address: contract,
      abi: NFT_ABI,
      functionName: 'name',
    });
  } catch (error) {
    console.log(error);
  }

  const function_ = assetType === 2 ? 'tokenURI' : 'uri';
  console.log('Calling', function_, 'on', contract);
  let uri: string | undefined;
  try {
    uri = await client.readContract({
      address: contract,
      abi: NFT_ABI,
      functionName: function_,
      args: [id],
    });
  } catch (error) {
    console.log(error);
  }

  if (!uri) return { name: 'NFT', image: undefined, collectionName };

  if (uri.startsWith('ipfs://'))
    uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

  try {
    const meta = await fetch(uri).then((r) => {
      return r.json();
    });
    let img: string | undefined = meta.image;
    if (img?.startsWith('ipfs://'))
      img = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return { name: meta.name ?? 'NFT', image: img, collectionName };
  } catch {
    return { name: 'NFT', image: undefined, collectionName };
  }
}

export {
  removeDonorStatus,
  setCreatorIfSessionPresent,
  getCreatorProfile,
  getPublicCreatorProfile,
  getPublicCreatorProfileBySlug,
  saveCreatorProfile,
  editCreatorProfile,
  deleteCreatorAccount,
} from './session';
export { useStartEarningNavigation } from './navigation';
