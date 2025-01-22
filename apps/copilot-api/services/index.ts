import { getQuote } from '@lifi/sdk';
import { dataSource } from '../db';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';
import {
  GetQuoteDataInterface,
  GetQuoteDataResponseInterface,
  TopAddressesResponseInterface,
} from '../types';

const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);

export const testSwapData = {
  transactionHash:
    '0xcbe526713e8c2095369191287c1fd4c1832716a55abe0b58db7ee91bebe21542',
  from: '0x4a3755eb99ae8b22aafb8f16f0c51cf68eb60b85',
  to: '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
  tokenIn: {
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    amount: 357.09,
    decimals: 18,
    network: 'BASE',
  },
  tokenOut: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    amount: 0.001,
    decimals: 18,
    network: 'BASE',
  },
  timestamp: '2024-10-28T16:13:17.698Z',
  isComplete: true,
};

export async function getQuoteData({
  fromAddress,
  originChain,
  destinationChain,
  originToken,
  destinationToken,
  amount,
}: GetQuoteDataInterface): Promise<GetQuoteDataResponseInterface> {
  const { estimate, type, tool, includedSteps, transactionRequest } =
    (await getQuote({
      fromAddress,
      fromChain: originChain,
      toChain: destinationChain,
      fromToken: originToken,
      toToken: destinationToken,
      fromAmount: amount,
    })) || {};

  return {
    success: true,
    estimate,
    type,
    tool,
    includedSteps,
    transactionData: transactionRequest,
  };
}

export async function getTopAddresses(): Promise<
  TopAddressesResponseInterface[]
> {
  return subscriptionsRepo
    .createQueryBuilder()
    .select(['address', 'CAST(COUNT(subscriber_id) AS INTEGER) as count'])
    .groupBy('address')
    .orderBy('count', 'DESC')
    .limit(10)
    .getRawMany();
}
