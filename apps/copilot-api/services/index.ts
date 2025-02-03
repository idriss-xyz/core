import { getQuote } from '@lifi/sdk';
import { dataSource } from '../db';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';
import {
  GetQuoteDataInterface,
  GetQuoteDataResponseInterface,
  TopAddressesResponseInterface,
} from '../types';

const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);

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
