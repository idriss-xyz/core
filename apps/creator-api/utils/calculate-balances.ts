import { createPublicClient, http, Hex, formatUnits } from 'viem';
import { Token } from '../db/entities/token.entity';
import {
  CHAIN_ID_TO_NFT_COLLECTIONS,
  ERC20_ABI,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import { AppDataSource } from '../db/database';
import { getAlchemyPrices, getZapperPrice } from './price-fetchers';
import { getChainByNetworkName } from '@idriss-xyz/utils';
import { ALCHEMY_BASE_URLS } from '../constants';

type NftBalance = {
  chainId: number;
  contract: string;
  collectionName: string;
  tokenId: string;
  balance: string;
  name?: string;
  image?: string;
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
): Promise<{ balances: NftBalance[] }> {
  const results: NftBalance[] = [];

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
      console.log(params);
      const ownedNfts = await fetchAllPages(url, params);

      const allowed = new Set(collections.map((c) => c.address.toLowerCase()));

      for (const nft of ownedNfts) {
        if (!allowed.has(nft.contract.address.toLowerCase())) continue;
        results.push({
          chainId,
          contract: nft.contract.address,
          collectionName: nft.contract.name,
          tokenId: nft.tokenId,
          balance: nft.balance,
          name: nft.name ?? nft.raw?.metadata?.name,
          image:
            nft.image?.cachedUrl ??
            nft.image?.originalUrl ??
            nft.raw?.metadata?.image ??
            null,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch NFTs for chain ${chainId}`, err);
    }
  }

  return { balances: results };
}
