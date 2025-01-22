// Extract swap data from activities
import { SwapData } from '../types';
import { NULL_ADDRESS } from '../constants';
import { isSubscribedAddress } from './subscriptionManager';

// Function to determine if the swap is complete
export function isCompleteSwap(swapData: SwapData): boolean {
  // Check all required fields
  const requiredFields = [
    'transactionHash',
    'from',
    'to',
    'tokenIn',
    'tokenOut',
  ];

  for (const field of requiredFields) {
    if (
      swapData[field as keyof SwapData] === null ||
      swapData[field as keyof SwapData] === undefined
    ) {
      return false;
    }
    if (
      (field === 'tokenIn' || field === 'tokenOut') &&
      (swapData[field as keyof SwapData] as { amount: number })['amount'] ===
        null
    ) {
      return false;
    }
  }

  // Ensure tokenIn and tokenOut are different
  return (
    swapData.tokenIn!.address.toLowerCase() !==
    swapData.tokenOut!.address.toLowerCase()
  );
}

export async function extractSwapData(
  txHash: string,
  activities: any[],
): Promise<SwapData> {
  const swapData: SwapData = {
    transactionHash: txHash,
    from: null,
    to: null,
    tokenIn: null,
    tokenOut: null,
    timestamp: new Date().toISOString(),
    isComplete: false,
  };

  for (const activity of activities) {
    const category = activity.category;

    if (category === 'external') {
      // Handle ETH transfers
      const isEthTransfer = activity.asset === 'ETH' && activity.value > 0;
      if (isEthTransfer) {
        if (
          (await isSubscribedAddress(activity.fromAddress)) &&
          !swapData.tokenOut
        ) {
          // User sent ETH (tokenOut)
          const tokenOut = {
            address: NULL_ADDRESS,
            symbol: activity.asset,
            amount: activity.value,
            decimals: activity.rawContract.decimals,
            network: activity.network,
          };
          swapData.tokenOut = tokenOut;
        }
      }
    } else if (category === 'token') {
      // Handle ERC20 token transfers
      const token = {
        address: activity.rawContract.address,
        symbol: activity.asset,
        amount: activity.value,
        decimals: activity.rawContract.decimals,
        network: activity.network,
      };
      if (
        (await isSubscribedAddress(activity.toAddress)) &&
        !swapData.tokenIn
      ) {
        // User received token (tokenIn)
        swapData.tokenIn = token;
        swapData.from = activity.toAddress;
        swapData.to = activity.fromAddress;
      } else if (
        (await isSubscribedAddress(activity.fromAddress)) &&
        !swapData.tokenOut
      ) {
        // User sent token (tokenOut)
        swapData.tokenOut = token;
        swapData.from = activity.fromAddress;
        swapData.to = activity.toAddress;
      }
    } else if (category === 'internal') {
      // User receives ETH
      const isEthTransfer = activity.asset === 'ETH' && activity.value > 0;
      if (isEthTransfer) {
        if (
          (await isSubscribedAddress(activity.toAddress)) &&
          !swapData.tokenIn
        ) {
          // User received ETH (tokenIn)
          const tokenIn = {
            address: NULL_ADDRESS,
            symbol: activity.asset,
            amount: activity.value,
            decimals: activity.rawContract.decimals,
            network: activity.network,
          };
          swapData.tokenIn = tokenIn;
          swapData.from = activity.toAddress;
          swapData.to = activity.fromAddress;
        }
      }
    }
  }

  // Check if swap is complete
  swapData.isComplete = isCompleteSwap(swapData);

  return swapData;
}
