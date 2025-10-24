import { MigrationInterface, QueryRunner } from 'typeorm';
import { createPublicClient, Hex, http } from 'viem';
import { NFT_ABI } from '@idriss-xyz/constants';
import { base, mainnet } from 'viem/chains';

const clientBase = createPublicClient({
  chain: base,
  transport: http('https://base-rpc.publicnode.com'),
});

const clientEthereum = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com'),
});

const clients = [
  {
    chain: 8453,
    client: clientBase,
    name: 'BASE_MAINNET',
  },
  {
    chain: 1,
    client: clientEthereum,
    name: 'ETHEREUM_MAINNET',
  },
];

type NftMeta = { name?: string };

async function getNftName(
  client: (typeof clients)[number]['client'],
  contract: Hex,
  id: bigint,
  assetType: number,
) {
  const function_ = assetType === 2 ? 'tokenURI' : 'uri';
  let uri: string | undefined;

  try {
    uri = await client.readContract({
      address: contract,
      abi: NFT_ABI,
      functionName: function_,
      args: [id],
    });
  } catch {
    return;
  }

  if (!uri) return;
  if (uri.startsWith('ipfs://'))
    uri = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

  /* ---------- fix Parallel “/tokens/” URLs ---------- */
  if (
    uri &&
    uri.includes('nftdata.parallelnft.com') &&
    uri.includes('/tokens/')
  ) {
    const hexId = `0x${id.toString(16).toUpperCase()}`;

    try {
      const url = new URL(uri);
      const segments = url.pathname.split('/');
      segments[segments.length - 1] = hexId;
      url.pathname = segments.join('/');
      uri = url.toString();
    } catch {
      // fallback in extremely unlikely malformed-URL case
      uri = uri.slice(0, uri.lastIndexOf('/') + 1) + hexId;
    }
  }
  /* -------------------------------------------------- */

  try {
    const meta = (await fetch(uri).then((r) => {
      return r.json();
    })) as NftMeta;
    return meta.name ?? null;
  } catch {
    return;
  }
}

export class FixIncorrectNftNames1759846236000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    const nfts: {
      id: number;
      collection_address: string;
      network: string;
      token_id: string;
    }[] = await q.query(
      `SELECT id, collection_address, network, token_id FROM nft_tokens;`,
    );

    for (const nft of nfts) {
      const clientInfo = clients.find((info) => {
        return info.name === nft.network;
      });
      if (!clientInfo) continue;

      const name = await getNftName(
        clientInfo.client,
        nft.collection_address as Hex,
        BigInt(nft.token_id),
        1,
      );

      if (!name) continue;

      await q.query(`UPDATE nft_tokens SET name = $1 WHERE id = $2;`, [
        name,
        nft.id,
      ]);
    }
  }

  public async down(): Promise<void> {
    // no revert
  }
}
