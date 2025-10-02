import { createPublicClient, http, Hex, formatUnits, erc1155Abi } from 'viem';
import { Token } from '../db/entities/token.entity';
import {
  Chain,
  CHAIN_ID_TO_NFT_COLLECTIONS,
  ERC20_ABI,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import { AppDataSource } from '../db/database';
import {
  getAlchemyPrices,
  getZapperPrice,
  fetchNftFloorFromOpensea,
} from './price-fetchers';
import { getChainById, getChainByNetworkName } from '@idriss-xyz/utils';
import { ALCHEMY_BASE_URLS, OPENSEA_BASE_URLS } from '../constants';
import { NftDonation } from '../db/entities/nft-donation.entity';

type NftBalance = {
  chainId: number;
  contract: string;
  collection: string;
  tokenId: string;
  balance: string;
  name?: string;
  image?: string;
  collectionImage?: string;
  collectionShortName: string;
  collectionCategory: string;
  usdValue?: number;
  type: 'erc721' | 'erc1155';
};

export async function calculateBalances(userAddress: Hex) {
  const tokenRepository = AppDataSource.getRepository(Token);
  const allTokens = await tokenRepository.find();

  const balancePromises = allTokens.map(async (token) => {
    const chain = getChainByNetworkName(token.network);
    if (!chain) return null;

    const client = createPublicClient({ chain, transport: http() });

    try {
      let balance: bigint;

      if (token.address.toLowerCase() === NULL_ADDRESS) {
        balance = await client.getBalance({ address: userAddress });
      } else {
        balance = await client.readContract({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAddress],
        });
      }

      if (balance === BigInt(0)) return null;

      const formattedBalance = formatUnits(balance, token.decimals);
      return { token, formattedBalance };
    } catch (error) {
      console.error(
        `Failed to fetch balance for ${token.symbol} on ${token.network}`,
        error,
      );
      return null;
    }
  });

  const balancesWithAmount = (await Promise.all(balancePromises)).filter(
    (b): b is NonNullable<typeof b> => b !== null,
  );

  if (balancesWithAmount.length === 0) {
    return {
      balances: [],
      summary: { totalUsdBalance: 0 },
    };
  }

  const tokensToPrice = balancesWithAmount.map(({ token }) => ({
    address: token.address,
    network: token.network,
  }));

  let prices: Record<string, number> = {};
  try {
    prices = await getAlchemyPrices(tokensToPrice);
  } catch (err) {
    console.error('Failed to batch fetch Alchemy prices:', err);
  }

  await Promise.all(
    balancesWithAmount.map(async ({ token }) => {
      const key = `${token.network}:${token.address.toLowerCase()}`;
      if (prices[key] === undefined) {
        const zapperPrice = await getZapperPrice(
          token.address,
          token.network,
          new Date(),
        );
        if (zapperPrice !== null) prices[key] = zapperPrice;
      }
    }),
  );

  let totalUsdBalance = 0;
  const balances = balancesWithAmount.map(({ token, formattedBalance }) => {
    const price =
      prices[`${token.network}:${token.address.toLowerCase()}`] ?? 0;
    const usdValue = parseFloat(formattedBalance) * price;
    totalUsdBalance += usdValue;

    return {
      ...token,
      balance: formattedBalance.toString(),
      usdValue,
    };
  });

  return {
    balances,
    summary: { totalUsdBalance },
  };
}

async function fetchAllNftsFromOpensea(
  chainId: number,
  address: Hex,
  collections?: string[],
) {
  const nfts: any[] = [];
  const baseUrl = `${OPENSEA_BASE_URLS[chainId]}/account/${address}/nfts`;
  const headers = {
    'accept': 'application/json',
    'x-api-key': process.env.OPENSEA_API_KEY!,
  };

  let next: string | undefined;
  do {
    const url = new URL(baseUrl);
    url.searchParams.set('limit', '200');
    if (next) url.searchParams.set('next', next);

    const resp = await fetch(url.toString(), { headers });
    if (!resp.ok) throw new Error(`OpenSea API error: ${resp.status}`);
    const json = await resp.json();
    nfts.push(...json.nfts);
    next = json.next;
  } while (next);

  if (collections && collections.length) {
    return nfts.filter((nft) => collections.includes(nft.collection));
  }
  return nfts;
}

async function fetchMetadataFromAlchemyBatch(
  chainId: number,
  tokens: { contractAddress: string; tokenId: string }[],
) {
  const url = `${ALCHEMY_BASE_URLS[chainId]}/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTMetadataBatch`;
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
  };

  const metadataMap: Record<
    string,
    { image: string | null; name: string | null }
  > = {};

  for (let i = 0; i < tokens.length; i += 100) {
    const batch = tokens.slice(i, i + 100);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tokens: batch }),
      });
      if (!resp.ok) throw new Error(`Alchemy metadata error: ${resp.status}`);
      const json = await resp.json();

      for (const item of json.nfts || []) {
        const key = `${item.contract.address.toLowerCase()}-${item.tokenId}`;
        metadataMap[key] = {
          image: item.image?.originalUrl ?? item.image?.thumbnailUrl ?? null,
          name: item.name ?? item.raw?.metadata?.name ?? null,
        };
      }
    } catch (err) {
      console.error('Failed to fetch batch metadata from Alchemy', err);
    }
  }

  return metadataMap;
}

async function fetch1155BalancesBatch(
  chain: Chain,
  contract: Hex,
  owner: Hex,
  tokenIds: bigint[],
) {
  const client = createPublicClient({ chain, transport: http() });
  const calls = tokenIds.map((id) => ({
    address: contract,
    abi: erc1155Abi,
    functionName: 'balanceOf',
    args: [owner, id],
  }));

  const results = await client.multicall({ contracts: calls });
  return results.map((r, i) => ({
    tokenId: tokenIds[i].toString(),
    balance: r.status === 'success' ? (r.result as bigint) : BigInt(0),
  }));
}

export async function calculateNftBalances(
  userAddress: Hex,
  includePrices = true,
): Promise<{ balances: NftBalance[]; summary: { totalUsdBalance: number } }> {
  const results: NftBalance[] = [];
  const nftDonationRepo = AppDataSource.getRepository(NftDonation);
  let totalUsdBalance = 0;

  for (const [chainIdOption, collections] of Object.entries(
    CHAIN_ID_TO_NFT_COLLECTIONS,
  )) {
    const chainId = Number(chainIdOption);
    if (!collections.length) continue;

    try {
      console.time(`opensea-${chainId}`);

      const ownedNfts = await fetchAllNftsFromOpensea(
        chainId,
        userAddress,
        collections.map((c) => c.slug),
      );
      console.timeEnd(`opensea-${chainId}`);

      const erc1155Buckets: Record<string, bigint[]> = {};
      const tokensForMetadata: { contractAddress: string; tokenId: string }[] =
        [];
      const interim: NftBalance[] = [];

      for (const nft of ownedNfts) {
        const meta = collections.find(
          (c) => c.address.toLowerCase() === nft.contract.toLowerCase(),
        );
        if (!meta) continue;

        const tokenId = nft.identifier;
        const type = nft.token_standard;

        if (type === 'erc1155') {
          if (!erc1155Buckets[nft.contract]) erc1155Buckets[nft.contract] = [];
          erc1155Buckets[nft.contract].push(BigInt(tokenId));
        }

        if (nft.contract && tokenId) {
          tokensForMetadata.push({
            contractAddress: nft.contract,
            tokenId,
          });
        }

        let usdValue: number | undefined;
        if (includePrices && meta.slug) {
          console.time(`floor-prices-${chainId}`);
          const floor = await fetchNftFloorFromOpensea(meta.slug, tokenId);
          console.timeEnd(`floor-prices-${chainId}`);

          if (floor?.usdValue) usdValue = floor.usdValue;
        }
        console.time(`db-lookups-${chainId}`);

        const dbRow = await nftDonationRepo.findOne({
          where: {
            collectionAddress: nft.contract.toLowerCase() as Hex,
            tokenId: Number(tokenId),
          },
        });
        console.timeEnd(`db-lookups-${chainId}`);

        interim.push({
          chainId,
          contract: nft.contract,
          collection: meta.name,
          tokenId,
          balance: '1', // defaulting to 1 as opensea only returns owned nfts (without exact balance)
          type,
          image: dbRow?.imageUrl ?? undefined,
          collectionImage: meta.image,
          usdValue,
          name: nft.name,
          collectionShortName: meta.shortName,
          collectionCategory: meta.category,
        });
      }

      // fetch metadata in bulk from Alchemy
      console.time(`alchemy-meta-${chainId}`);

      const metadataMap = await fetchMetadataFromAlchemyBatch(
        chainId,
        tokensForMetadata,
      );
      console.timeEnd(`alchemy-meta-${chainId}`);

      // merge metadata into interim results
      for (const entry of interim) {
        const key = `${entry.contract.toLowerCase()}-${entry.tokenId}`;
        const metaInfo = metadataMap[key];
        if (metaInfo) {
          entry.image = entry.image ?? metaInfo.image ?? undefined;
          entry.name = entry.name ?? metaInfo.name ?? undefined;
        }
        results.push(entry);
      }

      for (const [contract, ids] of Object.entries(erc1155Buckets)) {
        for (let i = 0; i < ids.length; i += 50) {
          const batch = ids.slice(i, i + 50);
          const chain = getChainById(chainId);
          if (!chain) continue;
          console.time(`erc1155-balances-${chainId}`);

          const balances = await fetch1155BalancesBatch(
            chain,
            contract as Hex,
            userAddress,
            batch,
          );
          console.timeEnd(`erc1155-balances-${chainId}`);

          for (const b of balances) {
            const entry = results.find(
              (r) => r.contract === contract && r.tokenId === b.tokenId,
            );
            if (entry) entry.balance = b.balance.toString();
          }
        }
      }
    } catch (err) {
      console.error(`Failed to fetch NFTs for chain ${chainId}`, err);
    }
  }

  for (const r of results) {
    if (r.usdValue) {
      totalUsdBalance += Number(r.balance) * r.usdValue;
    }
  }

  return {
    balances: results,
    summary: { totalUsdBalance },
  };
}
