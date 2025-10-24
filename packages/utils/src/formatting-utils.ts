import { PublicKey } from '@solana/web3.js';
import { Hex } from 'viem';
import { CHAIN, NATIVE_COIN_ADDRESS } from '@idriss-xyz/constants';

export const formatBigNumber = (number: number | string): string => {
  if (Number(number) < 1000) {
    return number.toString();
  }
  return number.toLocaleString('en-US', {
    minimumFractionDigits: Number(number) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

export const applyDecimalsToNumericString = (
  numericString: string,
  decimals: number,
): string => {
  // Check if the number string is valid
  if (!/^\d+$/.test(numericString)) {
    throw new Error('Invalid number string');
  }

  // If decimals is 0, return the number string as is
  if (decimals === 0) {
    return numericString;
  }

  // Calculate the position to insert the decimal point
  const length_ = numericString.length;
  const decimalPos = length_ - decimals;

  // If the position is less than or equal to 0, we need to pad with zeros at the start
  if (decimalPos <= 0) {
    return '0.' + '0'.repeat(Math.abs(decimalPos)) + numericString;
  }

  // Otherwise, insert the decimal point at the calculated position
  return (
    numericString.slice(0, decimalPos) + '.' + numericString.slice(decimalPos)
  );
};

export const isNativeTokenAddress = (tokenAddress: Hex) => {
  return tokenAddress === NATIVE_COIN_ADDRESS;
};

export const getChainById = (chainId: number) => {
  return Object.values(CHAIN).find((chain) => {
    return chain.id === chainId;
  });
};

const getBlockExplorers = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.blockExplorers;
};

export const getDefaultBlockExplorerUrl = (chainId: number) => {
  return getBlockExplorers(chainId)?.default.url;
};

export const getTransactionUrl = (properties: {
  chainId: number;
  transactionHash: Hex;
}) => {
  const { chainId, transactionHash } = properties;
  const baseUrl = getDefaultBlockExplorerUrl(chainId);
  if (!baseUrl) {
    return '#';
  }
  return `${baseUrl}/tx/${transactionHash}`;
};

export const getTransactionUrls = ({
  chainId,
  transactionHash,
}: {
  chainId: number;
  transactionHash: string;
}) => {
  const blockExplorers = getBlockExplorers(chainId);

  if (!blockExplorers) {
    return [];
  }

  return Object.keys(blockExplorers).map((key) => {
    const explorer = blockExplorers[key as keyof typeof blockExplorers];
    const url = explorer.url;

    return {
      blockExplorer: explorer.name,
      url: `${url}/tx/${transactionHash}`,
    };
  });
};

export const isUnrecognizedChainError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 4902
  );
};

export const getSafeNumber = (
  number: number,
): { value: number; decimals: number } => {
  // Convert the number to a string and split by the decimal point
  const numberString = number.toString();

  // Check if there is a decimal point in the number
  if (numberString.includes('.')) {
    const parts = numberString.split('.');
    const decimals = parts[1]?.length ?? 0;
    const value = number * 10 ** decimals;
    return { value: Math.floor(value), decimals };
  } else {
    // If no decimal point, the number is an integer
    const value = Number.parseInt(numberString, 10);
    return { value, decimals: 0 };
  }
};

export const getShortWalletHex = (walletAddress: string) => {
  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`;
};

export const getFormattedTimeDifference = (
  isoTimestamp: string | number,
  variant: 'long' | 'short',
) => {
  const currentDate = new Date();
  const targetDate = new Date(isoTimestamp);
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  const totalSeconds = Math.abs(Math.floor(differenceInMs / 1000));
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  let result = '';

  if (variant === 'long') {
    if (days > 0) {
      result += `${days} ${days > 1 ? 'days' : 'day'} `;
    }

    if (hours > 0 || days > 0) {
      result += `${hours} ${hours > 1 ? 'hrs' : 'hr'} `;
    }

    if (minutes > 0 || days > 0 || hours > 0) {
      result += `${minutes} ${minutes > 1 ? 'mins' : 'min'} `;
    }

    if (minutes < 1 && hours < 1 && days < 1) {
      result += `${seconds} ${seconds > 1 ? 'secs' : 'sec'}`;
    }
  } else if (variant === 'short') {
    if (days > 0) {
      result = `${days} ${days > 1 ? 'days' : 'day'}`;
    } else if (hours > 0) {
      result = `${hours} ${hours > 1 ? 'hrs' : 'hr'}`;
    } else if (minutes > 0) {
      result = `${minutes} ${minutes > 1 ? 'mins' : 'min'}`;
    } else if (seconds > 0) {
      result = `${seconds} ${seconds > 1 ? 'secs' : 'sec'}`;
    }
  }

  return result.trim();
};

export const getTimeDifferenceString = ({
  timestamp,
  text,
  variant,
}: {
  timestamp: string | number;
  text: string;
  variant: 'long' | 'short';
}) => {
  const timeDifference = getFormattedTimeDifference(timestamp, variant);

  return text ? `${timeDifference} ${text}` : timeDifference;
};

export const isSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

export const formatTokenValue = (
  value: number,
  options?: { isTooltip?: boolean },
): string => {
  const { isTooltip = false } = options ?? {};

  if (isTooltip) {
    // For tooltip, show full value with comma separators
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 18,
    });
  }

  if (value === 0) {
    return '0';
  }
  if (value > 0 && value < 0.001) {
    return '<0.001';
  }
  if (value >= 1_000_000_000) {
    return `${Number((value / 1_000_000_000).toFixed(2))}B`;
  }
  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(2))}M`;
  }
  if (value >= 1000) {
    return `${Number((value / 1000).toFixed(2))}K`;
  }
  if (value >= 1) {
    // Special case for values that round to a whole number like 1.000002 -> 1.00
    const rounded = Math.round(value * 100) / 100;
    if (rounded % 1 === 0 && value % 1 !== 0) {
      return rounded.toFixed(2);
    }
    // For other numbers, convert to string to trim trailing zeros e.g. 1.50 -> 1.5
    return String(rounded);
  }
  if (value >= 0.001) {
    // Show 2 significant digits and trim trailing zeros
    return String(Number(value.toPrecision(2)));
  }

  return String(value); // Fallback for any other case
};

export const formatFiatValue = (
  value: number,
  options?: { isTooltip?: boolean },
): string => {
  const { isTooltip = false } = options ?? {};

  if (isTooltip) {
    if (value === 0) {
      return '';
    }
    return (
      '$' +
      value.toLocaleString('en-US', {
        maximumFractionDigits: 20,
      })
    );
  }

  if (value === 0) {
    return '$0.00';
  }
  if (value > 0 && value < 0.01) {
    return '<$0.01';
  }
  if (value >= 1_000_000_000) {
    const value_ = value / 1_000_000_000;
    const truncated = Math.floor(value_ * 100) / 100;
    return `$${truncated.toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return '$' + value.toFixed(2);
};
