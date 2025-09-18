import { createPublicClient, http, Hex, formatUnits } from 'viem';
import { Token } from '../db/entities/token.entity';
import {
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
import { getChainByNetworkName } from '@idriss-xyz/utils';
import { ALCHEMY_BASE_URLS } from '../constants';
import { NftDonation } from '../db/entities/nft-donation.entity';

type NftBalance = {
  chainId: number;
  contract: string;
  collection: string;
  tokenId: string;
  balance: string;
  name?: string;
  image?: string;
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

async function fetchAllPages(url: string, params: URLSearchParams) {
  const owned: any[] = [];
  let pageKey: string | undefined;

  do {
    if (pageKey) params.set('pageKey', pageKey);

    const resp = await fetch(`${url}?${params}`);
    if (!resp.ok) throw new Error(`Alchemy error: ${resp.status}`);
    const json = await resp.json();

    owned.push(...(json.ownedNfts || []));
    pageKey = json.pageKey;
  } while (pageKey);

  return owned;
}

export async function calculateNftBalances(
  userAddress: Hex,
): Promise<{ balances: NftBalance[]; summary: { totalUsdBalance: number } }> {
  const results: NftBalance[] = [];
  const nftDonationRepo = AppDataSource.getRepository(NftDonation);
  let totalUsdBalance = 0;

  for (const [chainIdOption, collections] of Object.entries(
    CHAIN_ID_TO_NFT_COLLECTIONS,
  )) {
    const chainId = Number(chainIdOption);
    if (!collections.length) continue;

    const url = `${ALCHEMY_BASE_URLS[chainId]}/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner`;
    if (!url) continue;

    const params = new URLSearchParams({
      owner: userAddress,
      withMetadata: 'true',
    });
    for (const c of collections) {
      params.append('contractAddresses[]', c.address);
    }

    try {
      const ownedNfts = await fetchAllPages(url, params);

      for (const nft of ownedNfts) {
        const meta = collections.find(
          (c) => c.address.toLowerCase() === nft.contract.address.toLowerCase(),
        );
        if (!meta) continue;

        let usdValue: number | undefined;
        if (meta.slug) {
          const floor = await fetchNftFloorFromOpensea(meta.slug, nft.tokenId);
          if (floor?.usdValue) {
            usdValue = floor.usdValue * Number(nft.balance);
          }
        }
        totalUsdBalance += usdValue ?? 0;

        const dbRow = await nftDonationRepo.findOne({
          where: {
            collectionAddress: nft.contract.address.toLowerCase() as Hex,
            tokenId: Number(nft.tokenId),
          },
          select: ['imageUrl'],
        });
        const image =
          dbRow?.imageUrl ??
          nft.image?.cachedUrl ??
          nft.image?.originalUrl ??
          nft.raw?.metadata?.image ??
          null;

        results.push({
          chainId,
          contract: nft.contract.address,
          collection: nft.contract.name,
          tokenId: nft.tokenId,
          balance: nft.balance,
          type: meta.standard,
          image,
          usdValue,
          name: nft.name ?? nft.raw?.metadata?.name,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch NFTs for chain ${chainId}`, err);
    }
  }

  return {
    balances: results,
    summary: { totalUsdBalance },
  };
}
