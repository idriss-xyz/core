import { createPublicClient, http, Hex, formatUnits } from 'viem';
import { Token } from '../db/entities/token.entity';
import { ERC20_ABI } from '@idriss-xyz/constants';
import { NULL_ADDRESS } from '@idriss-xyz/constants';
import { AppDataSource } from '../db/database';
import { getAlchemyPrice } from './price-fetchers';
import { getChainByNetworkName } from '@idriss-xyz/utils';

export async function calculateBalances(userAddress: Hex) {
  const tokenRepository = AppDataSource.getRepository(Token);
  const allTokens = await tokenRepository.find();

  let totalUsdBalance = 0;

  const balancePromises = allTokens.map(async (token) => {
    const chain = getChainByNetworkName(token.network);
    if (!chain) {
      console.warn(`Unsupported network: ${token.network}. Skipping.`);
      return null;
    }

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    let balance: bigint;

    try {
      if (token.address.toLowerCase() === NULL_ADDRESS) {
        // Native token balance
        balance = await client.getBalance({ address: userAddress });
      } else {
        // ERC20 token balance
        balance = await client.readContract({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [userAddress],
        });
      }

      const formattedBalance = parseFloat(formatUnits(balance, token.decimals));

      if (formattedBalance === 0) {
        return null;
      }

      const price =
        (await getAlchemyPrice(token.address, token.network, new Date())) ?? 0;
      const usdValue = formattedBalance * price;

      totalUsdBalance += usdValue;

      return {
        ...token,
        balance: formattedBalance.toString(),
        usdValue: usdValue,
      };
    } catch (error) {
      console.error(
        `Failed to fetch balance for ${token.symbol} on ${token.network}`,
        error,
      );
      return null; // Return null on error for this token
    }
  });

  const settledBalances = await Promise.all(balancePromises);
  const validBalances = settledBalances.filter((b) => b !== null);

  return {
    balances: validBalances,
    summary: {
      totalUsdBalance: totalUsdBalance,
    },
  };
}
