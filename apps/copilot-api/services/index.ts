import { getQuote } from '@lifi/sdk';
import { dataSource } from '../db';
import { SubscribersEntity } from '../entities/subscribers.entity';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';

import {
  GetQuoteDataInterface,
  GetQuoteDataResponseInterface,
  StatsResponseInterface,
  TopAddressesResponseInterface,
} from '../types';

const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);
const subscribersRepo = dataSource.getRepository(SubscribersEntity);

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

export async function getStats(): Promise<StatsResponseInterface> {
  const [
    uniqueSubsResult,
    uniqueAddressesResult,
    dailyResult,
    weeklyResult,
    monthlyResult,
  ] = await Promise.all([
    subscriptionsRepo
      .createQueryBuilder()
      .select('COUNT(DISTINCT subscriber_id)', 'uniqueSubscribers')
      .getRawOne(),
    subscriptionsRepo
      .createQueryBuilder()
      .select('COUNT(DISTINCT address)', 'uniqueAddresses')
      .getRawOne(),
    subscribersRepo
      .createQueryBuilder()
      .select('COUNT(*)', 'dailyNewSubscribers')
      .where("created_at >= NOW() - INTERVAL '1 day'")
      .getRawOne(),
    subscribersRepo
      .createQueryBuilder()
      .select('COUNT(*)', 'weeklyNewSubscribers')
      .where("created_at >= NOW() - INTERVAL '7 day'")
      .getRawOne(),
    subscribersRepo
      .createQueryBuilder()
      .select('COUNT(*)', 'monthlyNewSubscribers')
      .where("created_at >= NOW() - INTERVAL '1 month'")
      .getRawOne(),
  ]);

  return {
    uniqueSubscribers: parseInt(uniqueSubsResult.uniqueSubscribers, 10),
    uniqueAddresses: parseInt(uniqueAddressesResult.uniqueAddresses, 10),
    dailyNewSubscribers: parseInt(dailyResult.dailyNewSubscribers, 10),
    weeklyNewSubscribers: parseInt(weeklyResult.weeklyNewSubscribers, 10),
    monthlyNewSubscribers: parseInt(monthlyResult.monthlyNewSubscribers, 10),
  };
}
