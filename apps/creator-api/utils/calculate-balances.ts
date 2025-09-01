import { createPublicClient, http, Hex, formatUnits } from 'viem';
import { Token } from '../db/entities/token.entity';
import { ERC20_ABI, NULL_ADDRESS } from '@idriss-xyz/constants';
import { AppDataSource } from '../db/database';
import { getAlchemyPrices, getZapperPrice } from './price-fetchers';
import { getChainByNetworkName } from '@idriss-xyz/utils';

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
        console.log(zapperPrice, token.name);
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
