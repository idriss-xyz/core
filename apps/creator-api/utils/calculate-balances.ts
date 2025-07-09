import { createPublicClient, http, Hex, formatUnits } from 'viem';
import { Token } from '../db/entities/token.entity';
import { getChainByNetworkName } from './network-utils';
import { ERC20_ABI } from '@idriss-xyz/constants';
import { NULL_ADDRESS } from '../constants';
import { AppDataSource } from '../db/database';

// Placeholder for a real price oracle (e.g., CoinGecko, 0x API)
// For now, it will return a mock price.
async function getUsdPrice(
  _tokenAddress: Hex,
  _network: string,
): Promise<number> {
  // TODO: Replace with a real price fetching service
  // Example: call CoinGecko API `simple/token_price/{id}`
  return 1.0; // Returning $1 for every token for now
}

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
      const price = await getUsdPrice(token.address, token.network);
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
