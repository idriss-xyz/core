import { WEBHOOK_NETWORK_TYPES } from '../constants';
import { HeliusWebhookEvent } from '../types';
import { SwapData } from '../types';

const getDecimalsFromBalanceChanges = (mint: string, balanceChanges: any[]) => {
  const match = balanceChanges.find((b) => b.mint === mint);
  return match?.rawTokenAmount?.decimals ?? 9;
};

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
    decimals: result?.token_info.decimals || null,
    name: result?.content.metadata.name || 'Unknown Token',
    logoURI: result?.content.links.image || null,
  };
};

// Parse Raydium Swaps
export async function parseSwapFromHelius(
  event: HeliusWebhookEvent,
): Promise<SwapData | null> {
  if (!event.tokenTransfers || event.tokenTransfers.length === 0) {
    console.error('No token transfers found.');
    return null;
  }

  const feePayer = event.feePayer;
  const transactionHash = event.signature;
  const timestamp = new Date(event.timestamp * 1000).toISOString();

  const tokenTransfers = event.tokenTransfers;
  const tokenBalanceChanges =
    event.accountData?.flatMap((a) => a.tokenBalanceChanges || []) || [];

  let sentTokens = [];
  let receivedTokens = [];
  let receivedMap = new Map();
  let sentMap = new Map();

  for (const transfer of tokenTransfers) {
    const { fromUserAccount, toUserAccount, mint, tokenAmount } = transfer;

    if (fromUserAccount === feePayer) {
      sentTokens.push(transfer);
      sentMap.set(mint, (sentMap.get(mint) || 0) + tokenAmount);
    }
    if (toUserAccount === feePayer) {
      receivedTokens.push(transfer);
      receivedMap.set(mint, (receivedMap.get(mint) || 0) + tokenAmount);
    }
  }

  let tokenIn = receivedTokens.find(
    (t) => sentMap.get(t.mint) === undefined,
  ) as any;
  let tokenOut = sentTokens.find(
    (t) => receivedMap.get(t.mint) === undefined,
  ) as any;

  if (!tokenIn || !tokenOut) {
    console.error('Failed to determine tokenIn or tokenOut.');
    return null;
  }

  tokenIn.decimals = getDecimalsFromBalanceChanges(
    tokenIn.mint,
    tokenBalanceChanges,
  );
  tokenOut.decimals = getDecimalsFromBalanceChanges(
    tokenOut.mint,
    tokenBalanceChanges,
  );

  const [tokenInMetadata, tokenOutMetadata] = await Promise.all([
    getTokenMetadata(tokenIn.mint),
    getTokenMetadata(tokenOut.mint),
  ]);

  tokenIn.symbol = tokenInMetadata.symbol;
  tokenIn.decimals = tokenInMetadata.decimals;
  tokenIn.name = tokenInMetadata.name;
  tokenIn.logoURI = tokenInMetadata.logoURI;

  tokenOut.symbol = tokenOutMetadata.symbol;
  tokenOut.decimals = tokenOutMetadata.decimals;
  tokenOut.name = tokenOutMetadata.name;
  tokenOut.logoURI = tokenOutMetadata.logoURI;

  return {
    transactionHash,
    from: feePayer,
    to: 'Raydium',
    tokenIn: {
      address: tokenIn.mint,
      amount: tokenIn.tokenAmount,
      decimals: tokenIn.decimals,
      symbol: tokenIn.symbol,
      name: tokenIn.name,
      logoURI: tokenIn.logoURI,
      network: WEBHOOK_NETWORK_TYPES.SOLANA,
    },
    tokenOut: {
      address: tokenOut.mint,
      amount: tokenOut.tokenAmount,
      decimals: tokenOut.decimals,
      symbol: tokenOut.symbol,
      name: tokenOut.name,
      logoURI: tokenOut.logoURI,
      network: WEBHOOK_NETWORK_TYPES.SOLANA,
    },
    timestamp,
    isComplete: event.transactionError === null,
  };
}

// Parse Jupiter Swaps
export async function parseJupiterSwap(
  event: HeliusWebhookEvent,
): Promise<SwapData | null> {
  if (!event.events || !event.events.swap) {
    console.error('No swap event found.');
    return null;
  }

  const feePayer = event.feePayer;
  const transactionHash = event.signature;
  const timestamp = new Date(event.timestamp * 1000).toISOString();

  const tokenTransfers = event.tokenTransfers || [];
  const nativeTransfers = event.nativeTransfers || [];
  const tokenBalanceChanges =
    event.accountData?.flatMap((a) => a.tokenBalanceChanges || []) || [];

  let tokenIn = null;
  let tokenOut = null;
  let swapContract = null;

  for (const transfer of tokenTransfers) {
    const decimals = getDecimalsFromBalanceChanges(
      transfer.mint,
      tokenBalanceChanges,
    );

    if (transfer.fromUserAccount === feePayer) {
      tokenOut = {
        address: transfer.mint,
        amount: Math.abs(transfer.tokenAmount),
        decimals,
        symbol: null,
        name: null,
        logoURI: null,
        network: WEBHOOK_NETWORK_TYPES.SOLANA,
      };
    }
    if (transfer.toUserAccount === feePayer) {
      tokenIn = {
        address: transfer.mint,
        amount: transfer.tokenAmount,
        decimals,
        symbol: null,
        name: null,
        logoURI: null,
        network: WEBHOOK_NETWORK_TYPES.SOLANA,
      };
    }
  }

  for (const transfer of nativeTransfers) {
    if (transfer.fromUserAccount === feePayer && !tokenOut) {
      tokenOut = {
        address: 'So11111111111111111111111111111111111111112',
        amount: transfer.amount / 1e9,
        decimals: 9,
        symbol: 'SOL',
        name: WEBHOOK_NETWORK_TYPES.SOLANA,
        logoURI: null,
        network: WEBHOOK_NETWORK_TYPES.SOLANA,
      };
    }
  }

  if (!tokenIn || !tokenOut) {
    console.error('Failed to determine tokenIn or tokenOut.');
    return null;
  }

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
    transactionHash,
    from: feePayer,
    to: swapContract,
    tokenIn,
    tokenOut,
    timestamp,
    isComplete: event.transactionError === null,
  };
}
