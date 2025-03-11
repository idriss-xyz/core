// Extract swap data from activities
import { HeliusWebhookEvent, SwapData } from '../types';
import { NULL_ADDRESS, WEBHOOK_NETWORK_TYPES } from '../constants';
import { isSubscribedAddress } from './subscriptionManager';
import { parseJupiterSwap, parseSwapFromHelius } from '../utils/swapDataParsers';
import { error } from 'console';

// Function to determine if the swap is complete
function isCompleteSwap(swapData: SwapData): boolean {
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

// Extract swap data from activities
export async function extractAlchemySwapData(
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
          (await isSubscribedAddress(
            activity.fromAddress,
            WEBHOOK_NETWORK_TYPES.EVM,
          )) &&
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
        (await isSubscribedAddress(
          activity.toAddress,
          WEBHOOK_NETWORK_TYPES.EVM,
        )) &&
        !swapData.tokenIn
      ) {
        // User received token (tokenIn)
        swapData.tokenIn = token;
        swapData.from = activity.toAddress;
        swapData.to = activity.fromAddress;
      } else if (
        (await isSubscribedAddress(
          activity.fromAddress,
          WEBHOOK_NETWORK_TYPES.EVM,
        )) &&
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
          (await isSubscribedAddress(
            activity.toAddress,
            WEBHOOK_NETWORK_TYPES.EVM,
          )) &&
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

export async function extractHeliusSwapData(data: any): Promise<SwapData> {
  const eventData = data as HeliusWebhookEvent;

  const isJupiterSwap = eventData.source === 'JUPITER';
  const result = isJupiterSwap
    ? await parseJupiterSwap(eventData)
    : await parseSwapFromHelius(eventData);

  if (result == null) {
    console.error('Failed to parse swap data from Helius event.');
    throw error
  }
  return result;
}