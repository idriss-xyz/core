import { Hex } from 'viem';

import { CHAIN, NATIVE_COIN_ADDRESS } from './constants';

export const formatBigNumber = (number: number | string): string => {
  if (Number(number) < 1000) {
    return number.toString();
  }
  return number.toLocaleString('en-US', {
    minimumFractionDigits: Number(number) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
};

function extractSignificantNumber(number: string) {
  const decimal = number.split('.')[1] ?? '';

  const significantPart = decimal.replace(/0+$/, '');
  const leadingZeros = /^0+/.exec(significantPart)?.[0] ?? '';

  if (!leadingZeros || leadingZeros.length <= 2) {
    return { value: number, zeros: 0 };
  }

  const firstNonZero = /[1-9]/.exec(significantPart);
  const numberPart = significantPart.slice(firstNonZero?.index) ?? 0;

  return {
    value: Math.round(Number(numberPart.slice(0, 2))),
    zeros: leadingZeros.length - 1,
  };
}

export const roundToSignificantFiguresForCopilotTrading = (
  number: number,
  significantFigures: number,
): { value: number | string; index: number | null } => {
  if (number === 0) {
    return {
      value: 0,
      index: null,
    };
  }

  if (number >= 1_000_000_000) {
    return {
      value: `${(number / 1_000_000_000).toFixed(significantFigures)}B`,
      index: null,
    };
  }
  if (number >= 1_000_000) {
    return {
      value: `${(number / 1_000_000).toFixed(significantFigures)}M`,
      index: null,
    };
  }
  if (number >= 1000) {
    return {
      value: `${(number / 1000).toFixed(significantFigures)}K`,
      index: null,
    };
  }

  if (number.toString().includes('e')) {
    const scienceNumberArray = number.toString().split('e-');
    const decimals = scienceNumberArray?.[1] ?? '2';
    const startingDecimals =
      scienceNumberArray?.[0]?.split('.')?.[1]?.length ?? 0;
    const { value: significantNumber, zeros: indexZeros } =
      extractSignificantNumber(
        Number(number).toFixed(Number(decimals) + Number(startingDecimals)),
      ) || {};

    return {
      value: significantNumber,
      index: indexZeros,
    };
  }

  const { value, zeros } = extractSignificantNumber(number.toString());

  if (zeros >= 2 && number < 1) {
    return {
      value,
      index: zeros,
    };
  }

  const offset = 0.000_000_001;
  const multiplier = Math.pow(10, significantFigures);
  const rounded_number =
    Math.round((number + offset) * multiplier) / multiplier;

  return {
    value: rounded_number,
    index: null,
  };
};

export const roundToSignificantFigures = (
  number: number,
  significantFigures: number,
): number | string => {
  if (number === 0) {
    return 0;
  }

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(significantFigures)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(significantFigures)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(significantFigures)}K`;
  }

  const multiplier = Math.pow(
    10,
    significantFigures - Math.floor(Math.log10(Math.abs(number))) - 1,
  );

  return Math.round(number * multiplier) / multiplier;
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
  return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
};

const getFormattedTimeDifference = (
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
  let timeDifference = getFormattedTimeDifference(timestamp, variant);

  setInterval(() => {
    timeDifference = getFormattedTimeDifference(timestamp, variant);
  }, 1000);

  return text ? `${timeDifference} ${text}` : timeDifference;
};
