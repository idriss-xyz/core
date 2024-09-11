// TODO: crypto package is deprecated, try to replace it with crypto-js, I tried but was not able to succeed because polymarket api throws 401
// eslint-disable-next-line unicorn/prefer-node-protocol
import crypto from 'crypto';

import { parseUnits } from 'viem';

import { CHAIN, Hex } from 'shared/web3';

import {
  COLLATERAL_TOKEN_DECIMALS,
  CONDITIONAL_TOKEN_DECIMALS,
  EVENT_URL_REGEX,
  MATIC_CONTRACTS,
  ORDER_STRUCTURE,
  POLYMARKET_GNOSIS_SAFE_SIGNATURE,
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
  ROUNDING_CONFIG,
  SIDE,
  SIDE_AS_NUMBER,
} from './constants';
import {
  BookItem,
  OrderData,
  RoundConfig,
  SaltedOrderData,
  TickSize,
} from './types';

export const calculateTotalSharesForAmount = (
  asks: BookItem[],
  balance: number,
): number => {
  let totalSpent = 0;
  let totalShares = 0;

  const sortedAsks = [...asks].sort((a, b) => {
    return Number(a.price) - Number(b.price);
  });

  for (const ask of sortedAsks) {
    const price = Number(ask.price);
    const size = Number(ask.size);
    const costForAllSharesAtThisPrice = price * size;
    if (totalSpent + costForAllSharesAtThisPrice <= balance) {
      totalSpent += costForAllSharesAtThisPrice;
      totalShares += size;
    } else {
      const remainingBalance = balance - totalSpent;
      const sharesToBuy = remainingBalance / price;
      totalSpent += sharesToBuy * price;
      totalShares += sharesToBuy;
      break;
    }
  }

  return totalShares;
};

export const isEventUrl = (url: string) => {
  const urlMatch = url.match(EVENT_URL_REGEX);
  return Boolean(urlMatch?.[0]);
};

export const buildL1SignaturePayload = (properties: {
  address: Hex;
  timestamp: string;
}) => {
  const { address, timestamp } = properties;
  const domain = {
    name: 'ClobAuthDomain',
    version: '1',
    chainId: BigInt(CHAIN.POLYGON.id),
  };

  const types = {
    ClobAuth: [
      { name: 'address', type: 'address' },
      { name: 'timestamp', type: 'string' },
      { name: 'nonce', type: 'uint256' },
      { name: 'message', type: 'string' },
    ],
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
    ],
  } as const;

  const message = {
    address: address,
    timestamp,
    nonce: BigInt(0),
    message: 'This message attests that I control the given wallet',
  };

  return {
    chainId: `eip:${CHAIN.POLYGON.id}`,
    domain,
    types,
    message,
    primaryType: 'ClobAuth',
  } as const;
};

export const buildMarketBuyOrderCreationArguments = (properties: {
  tokenId: string;
  amount: number;
  address: string;
  funderAddress: string;
  tickSize: TickSize;
}): OrderData => {
  const { address, tokenId, funderAddress, tickSize, amount } = properties;
  const taker = '0x0000000000000000000000000000000000000000';
  const feeRateBps = '0';
  const nonce = '0';
  const expiration = '0';
  const signer = address;
  const maker = funderAddress;
  const roundConfig = ROUNDING_CONFIG[tickSize];
  const side = SIDE_AS_NUMBER.BUY;
  const signatureType = POLYMARKET_GNOSIS_SAFE_SIGNATURE;

  const { rawMakerAmt, rawTakerAmt } = getMarketBuyOrderRawAmounts(
    amount,
    1,
    roundConfig,
  );

  const makerAmount = parseUnits(
    rawMakerAmt.toString(),
    COLLATERAL_TOKEN_DECIMALS,
  ).toString();
  const takerAmount = parseUnits(
    rawTakerAmt.toString(),
    CONDITIONAL_TOKEN_DECIMALS,
  ).toString();

  return {
    side,
    nonce,
    taker,
    maker,
    signer,
    tokenId,
    feeRateBps,
    expiration,
    makerAmount,
    takerAmount,
    signatureType,
  };
};

const getMarketBuyOrderRawAmounts = (
  amount: number,
  price: number,
  roundConfig: RoundConfig,
): { rawMakerAmt: number; rawTakerAmt: number } => {
  // force 2 decimals places
  const rawMakerAmt = roundDown(amount, roundConfig.size);
  const rawPrice = roundDown(price, roundConfig.price);

  let rawTakerAmt = rawMakerAmt / rawPrice;
  if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
    rawTakerAmt = roundUp(rawTakerAmt, roundConfig.amount + 4);
    if (decimalPlaces(rawTakerAmt) > roundConfig.amount) {
      rawTakerAmt = roundDown(rawTakerAmt, roundConfig.amount);
    }
  }

  return {
    rawMakerAmt,
    rawTakerAmt,
  };
};

const roundDown = (number_: number, decimals: number): number => {
  if (decimalPlaces(number_) <= decimals) {
    return number_;
  }
  return Math.floor(number_ * 10 ** decimals) / 10 ** decimals;
};

const roundUp = (number_: number, decimals: number): number => {
  if (decimalPlaces(number_) <= decimals) {
    return number_;
  }
  return Math.ceil(number_ * 10 ** decimals) / 10 ** decimals;
};

const decimalPlaces = (number_: number): number => {
  if (Number.isInteger(number_)) {
    return 0;
  }

  const array = number_.toString().split('.');
  if (array.length <= 1) {
    return 0;
  }

  return array[1]?.length ?? 0;
};

const generateOrderSalt = () => {
  return Math.round(Math.random() * Date.now()) + '';
};

export const buildOrder = (properties: { orderData: OrderData }) => {
  const { orderData } = properties;
  const order = {
    salt: generateOrderSalt(),
    ...orderData,
  };

  return order;
};

export const buildOrderSignaturePayload = ({
  negRisk,
  order,
}: {
  negRisk: boolean;
  order: SaltedOrderData;
}) => {
  const exchangeContract = negRisk
    ? MATIC_CONTRACTS.negRiskExchange
    : MATIC_CONTRACTS.exchange;

  return {
    chainId: `eip:${CHAIN.POLYGON.id}`,
    primaryType: 'Order',
    types: {
      Order: ORDER_STRUCTURE,
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
    },
    domain: {
      name: PROTOCOL_NAME,
      version: PROTOCOL_VERSION,
      chainId: BigInt(CHAIN.POLYGON.id),
      verifyingContract: exchangeContract,
    },
    message: {
      salt: order.salt,
      maker: order.maker,
      signer: order.signer,
      taker: order.taker,
      tokenId: order.tokenId,
      makerAmount: order.makerAmount,
      takerAmount: order.takerAmount,
      expiration: order.expiration,
      nonce: order.nonce,
      feeRateBps: order.feeRateBps,
      side: order.side,
      signatureType: order.signatureType,
    },
  } as const;
};

export const orderToJson = (
  order: SaltedOrderData,
  orderSignature: string,
  owner: string,
) => {
  return {
    order: {
      salt: Number.parseInt(order.salt, 10),
      maker: order.maker,
      signer: order.signer,
      taker: order.taker,
      tokenId: order.tokenId,
      makerAmount: order.makerAmount,
      takerAmount: order.takerAmount,
      side: SIDE.BUY,
      expiration: order.expiration,
      nonce: order.nonce,
      feeRateBps: order.feeRateBps,
      signatureType: order.signatureType,
      signature: orderSignature,
    },
    owner,
    orderType: 'FOK',
  } as const;
};

export const buildPolyHmacSignature = (
  secret: string,
  timestamp: string,
  method: string,
  requestPath: string,
  body?: string,
): string => {
  let message = timestamp + method + requestPath;
  if (body !== undefined) {
    message += body;
  }
  const base64Secret = Buffer.from(secret, 'base64');
  const hmac = crypto.createHmac('sha256', base64Secret);
  const sig = hmac.update(message).digest('base64');

  // NOTE: Must be url safe base64 encoding, but keep base64 "=" suffix
  // Convert '+' to '-'
  // Convert '/' to '_'
  const sigUrlSafe = replaceAll(replaceAll(sig, '+', '-'), '/', '_');
  return sigUrlSafe;
};

const replaceAll = (s: string, search: string, replace: string) => {
  return s.split(search).join(replace);
};
