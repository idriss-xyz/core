import { Hex } from 'viem';

import { NFT_ABI } from '../../constants/src';
import { clients } from '../../blockchain-clients/src';

type NftMeta = {
  name?: string;
  image?: string;
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
    const meta = (await fetch(uri).then((r) => {
      return r.json();
    })) as NftMeta;
    let img: string | undefined = meta.image;
    if (img?.startsWith('ipfs://'))
      img = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return { name: meta.name ?? 'NFT', image: img, collectionName };
  } catch {
    return { name: 'NFT', image: undefined, collectionName };
  }
}

export async function fetchPreferredImage(
  tokenId: bigint,
  collectionAddress: Hex,
  chainId: number,
  assetType = 3,
) {
  const clientInfo = clients.find((info) => {
    return info.chain === chainId;
  });

  if (!clientInfo) return;

  const function_ = assetType === 2 ? 'tokenURI' : 'uri';
  let uri: string | undefined;
  try {
    uri = await clientInfo.client.readContract({
      address: collectionAddress,
      abi: NFT_ABI,
      functionName: function_,
      args: [tokenId],
    });
  } catch (error) {
    console.log(error);
  }

  if (!uri) return;

  if (uri.startsWith('ipfs://'))
    uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

  try {
    const meta = (await fetch(uri).then((r) => {
      return r.json();
    })) as NftMeta;
    let img: string | undefined = meta.image;
    if (img?.startsWith('ipfs://'))
      img = img.replace('ipfs://', 'https://ipfs.io/ipfs/');
    return img;
  } catch {
    return;
  }
}
