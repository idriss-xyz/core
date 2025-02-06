import { ComplexHeliusWebhookEvent } from '../interfaces';
import { SwapData } from '../types';

// Fetch Token Metadata using Metaplex Token Metadata
const getTokenMetadata = async (mintAddress: string) => {
  const url = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'get-asset',
      method: 'getAsset',
      params: {
        id: mintAddress,
      },
    }),
  });

  const { result } = await response.json();
  return {
    symbol: result?.content.metadata.symbol || 'UNKNOWN',
    name: result?.content.metadata.name || 'Unknown Token',
    logoURI: result?.content.links.image || null,
  };
};

// Parse Raydium Swaps
export async function parseSwapFromHelius(
  event: ComplexHeliusWebhookEvent,
): Promise<SwapData | null> {
  if (!event.tokenTransfers || event.tokenTransfers.length === 0) {
    console.error('No token transfers found in event.');
    return null;
  }

  let tokenIn = null,
    tokenOut = null;
  let fromAddress = null,
    toAddress = null;
  const feePayer = event.feePayer;

  for (const transfer of event.tokenTransfers) {
    if (!tokenOut || transfer.tokenAmount < 0) {
      tokenOut = {
        address: transfer.mint,
        amount: Math.abs(transfer.tokenAmount),
        decimals: transfer.tokenStandard === 'Fungible' ? 9 : 0,
        symbol: null,
        name: null,
        logoURI: null,
        network: 'SOLANA',
      };
      fromAddress = transfer.fromUserAccount;
    }
    if (!tokenIn || transfer.tokenAmount > 0) {
      tokenIn = {
        address: transfer.mint,
        amount: transfer.tokenAmount,
        decimals: transfer.tokenStandard === 'Fungible' ? 9 : 0,
        symbol: null,
        name: null,
        logoURI: null,
        network: 'SOLANA',
      };
      toAddress = transfer.toUserAccount;
    }
  }

  if (!tokenIn || !tokenOut) {
    console.error('Incomplete token transfer data.');
    return null;
  }

  if (!fromAddress) {
    fromAddress = feePayer;
  }

  // Fetch metadata for tokenIn and tokenOut
  const [tokenInMetadata, tokenOutMetadata] = await Promise.all([
    getTokenMetadata(tokenIn.address),
    getTokenMetadata(tokenOut.address),
  ]);

  tokenIn.symbol = tokenInMetadata.symbol;
  tokenIn.name = tokenInMetadata.name;
  tokenIn.logoURI = tokenInMetadata.logoURI;

  tokenOut.symbol = tokenOutMetadata.symbol;
  tokenOut.name = tokenOutMetadata.name;
  tokenOut.logoURI = tokenOutMetadata.logoURI;

  return {
    transactionHash: event.signature,
    from: fromAddress,
    to: toAddress,
    tokenIn,
    tokenOut,
    timestamp: new Date().toISOString(),
    isComplete: true,
  };
}

// Parse Jupiter Swaps
export async function parseJupiterSwap(
  event: ComplexHeliusWebhookEvent,
): Promise<SwapData | null> {
  if (!event.events || !event.events.swap) {
    console.error('No Jupiter swap event found.');
    return null;
  }

  const swapEvent = event.events.swap;
  const firstSwap = swapEvent.innerSwaps?.[0]; // First inner swap (if exists)

  if (
    !firstSwap ||
    !firstSwap.tokenInputs.length ||
    !firstSwap.tokenOutputs.length
  ) {
    console.error('No token inputs/outputs found in Jupiter swap.');
    return null;
  }

  // Jupiter's tokenInputs[] are actually spent (should be tokenOut)
  // Jupiter's tokenOutputs[] are actually received (should be tokenIn)
  const tokenOutData = firstSwap.tokenInputs[0]; // Token user spent
  const tokenInData = firstSwap.tokenOutputs[0]; // Token user received

  const tokenIn = {
    address: tokenInData.mint,
    amount: tokenInData.tokenAmount,
    decimals: 9,
    symbol: null,
    name: null,
    logoURI: null,
    network: 'SOLANA',
  };

  const tokenOut = {
    address: tokenOutData.mint,
    amount: tokenOutData.tokenAmount,
    decimals: 9,
    symbol: null,
    name: null,
    logoURI: null,
    network: 'SOLANA',
  };

  // Fetch metadata for tokenIn and tokenOut
  const [tokenInMetadata, tokenOutMetadata] = await Promise.all([
    getTokenMetadata(tokenIn.address),
    getTokenMetadata(tokenOut.address),
  ]);

  tokenIn.symbol = tokenInMetadata.symbol;
  tokenIn.name = tokenInMetadata.name;
  tokenIn.logoURI = tokenInMetadata.logoURI;

  tokenOut.symbol = tokenOutMetadata.symbol;
  tokenOut.name = tokenOutMetadata.name;
  tokenOut.logoURI = tokenOutMetadata.logoURI;

  return {
    transactionHash: event.signature,
    from: tokenOutData.fromUserAccount, // The actual sender of tokenOut
    to: tokenInData.toUserAccount, // The final receiver of tokenIn
    tokenIn,
    tokenOut,
    timestamp: new Date().toISOString(),
    isComplete: true,
  };
}
