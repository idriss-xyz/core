'use client';
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@idriss-xyz/ui/charts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { Bar, BarChart, XAxis } from 'recharts';
import { Icon } from '@idriss-xyz/ui/icon';
import { useMemo } from 'react';
import { formatFiatValue } from '@idriss-xyz/utils';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';
import { classes } from '@idriss-xyz/ui/utils';

import { backgroundLines2, IDRISS_COIN, IDRISS_SCENE_STREAM_4 } from '@/assets';


import { useAuth } from '../../../context/auth-context';
import SkeletonEarnings from '../loading';

import { TokenLogo } from './token-logo';
import { useGetRecipientStats } from './commands/get-recipient-stats';

import { CopyButton } from '@/app/components/copy-button/copy-button';
import { DonateHistoryItem } from '@/app/donate/components/donate-history/donate-history-item';
import { useGetTipHistory } from '@/app/app/commands/get-donate-history';

const chartConfig = {
  donations: {
    label: 'Donations',
    color: '#f3f4f6',
  },
} satisfies ChartConfig;

// ts-unused-exports:disable-next-line
export default function EarningsStats() {
  const { user, ready, authenticated } = usePrivy();
  const { creator } = useAuth();
  const address = user?.wallet?.address as Hex | undefined;
  const tipHistoryQuery = useGetTipHistory(
    {
      address,
    },
    { enabled: ready && authenticated && !!address },
  );
  const recipientStatsQuery = useGetRecipientStats(
    {
      address,
    },
    { enabled: ready && authenticated && !!address },
  );

  const donations = tipHistoryQuery.data?.donations ?? [];
  const sortedDonations = [...donations].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  const stats = recipientStatsQuery.data;

  const { totalEarnings, chartData, mainAsset, otherAssets } = useMemo(() => {
    if (!stats) {
      return {
        totalEarnings: 0,
        chartData: [],
        mainAsset: null,
        otherAssets: [],
      };
    }

    const totalEarnings = stats.donationsWithTimeAndAmount.reduce(
      (sum, item) => {
        return sum + item.amount;
      },
      0,
    );

    // --- NEW, CORRECTED LOGIC FOR ROLLING 12-MONTH CHART ---
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const today = new Date();
    const monthlyData = [];

    // 1. Create the template for the last 12 months, including year info.
    for (let index = 11; index >= 0; index--) {
      const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      if (month) {
        monthlyData.push({
          month,
          year,
          donations: 0,
        });
      }
    }

    // 2. Aggregate data from the API, matching on both month AND year.
    for (const item of stats.donationsWithTimeAndAmount) {
      const index = monthlyData.findIndex((d) => {
        return d.month === item.month && d.year === item.year;
      });
      const monthEntry = monthlyData[index];
      if (monthEntry) {
        monthEntry.donations += item.amount;
      }
    }
    // --- END OF NEW LOGIC ---

    const sortedAssets = [...stats.earningsByTokenOverview].sort((a, b) => {
      return b.totalAmount - a.totalAmount;
    });

    return {
      totalEarnings,
      chartData: monthlyData,
      mainAsset: sortedAssets[0] ?? null,
      otherAssets: sortedAssets.slice(1, 4),
    };
  }, [stats]);

  if (
    !ready ||
    !authenticated ||
    tipHistoryQuery.isLoading ||
    recipientStatsQuery.isLoading
  ) {
    return <SkeletonEarnings />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {sortedDonations.length > 0 && stats ? (
        <>
          <Card className="col-span-1 flex flex-col">
            <CardHeader className="text-neutral-900">Transactions</CardHeader>
            <CardBody className="flex grow items-center justify-center">
              <div className="relative">
                <div className="mx-8 flex items-center justify-center p-6">
                  <img
                    src={IDRISS_COIN.src}
                    alt="coin"
                    className="w-[198px] transition-all duration-300 ease-in-out 2xl:w-[220px]"
                  />
                </div>
                <span
                  className={classes(
                    'pointer-events-none absolute left-2 top-12 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-black',
                  )}
                >
                  <Icon
                    size={24}
                    name="HandCoins"
                    className={classes(
                      'mr-1 rounded-full bg-mint-600 p-1 text-white',
                    )}
                  />
                  {stats.totalDonationsCount} donation
                  {stats.totalDonationsCount !== 1 && 's'}
                </span>
                <span
                  className={classes(
                    'pointer-events-none absolute right-2 top-8 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-mint-900',
                  )}
                >
                  <Icon
                    size={24}
                    name="Users2"
                    className={classes(
                      'mr-1 rounded-full bg-mint-600 p-1 text-white',
                    )}
                  />
                  {stats.distinctDonorsCount} donor
                  {stats.distinctDonorsCount !== 1 && 's'}
                </span>
                <span
                  className={classes(
                    'pointer-events-none absolute bottom-4 right-2 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-mint-900',
                  )}
                >
                  <Icon
                    size={24}
                    name="TrendingUp"
                    className={classes(
                      'mr-1 rounded-full bg-mint-600 p-1 text-white',
                    )}
                  />
                  {formatFiatValue(stats.biggestDonation)} largest donation
                </span>
              </div>
            </CardBody>
          </Card>
          <Card className="col-span-1 flex flex-col justify-between">
            <CardHeader className="flex items-start justify-between text-neutral-900">
              Total earnings
              <div className="flex items-center gap-2">
                <span className={classes('text-heading3 text-black')}>
                  {formatFiatValue(totalEarnings)}
                </span>
                <TooltipProvider delayDuration={400}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        className="text-neutral-600"
                        name="HelpCircle"
                        size={24}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-center text-white">
                      <p>Value of assets at the time of receiving</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardBody>
              <ChartContainer
                config={chartConfig}
                className="min-h-[200px] w-full"
              >
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value: string | number) => {
                      return typeof value === 'string'
                        ? value.slice(0, 3)
                        : value.toString();
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideIndicator
                        hideLabel
                        hideValueName
                        formatter={(value) => {
                          return `${formatFiatValue(Number(value))}`;
                        }}
                        className={classes('text-label4 font-medium')}
                      />
                    }
                  />
                  <Bar
                    dataKey="donations"
                    fill="var(--color-donations)"
                    radius={4}
                    activeBar={{ fill: '#E7FED8' }}
                  />
                </BarChart>
              </ChartContainer>
            </CardBody>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="text-neutral-900">
              Earnings by asset
            </CardHeader>
            <CardBody>
              <div className="space-y-4 p-4">
                {mainAsset && (
                  <div className="flex items-center gap-3">
                    <div
                      className={classes(
                        'relative size-[70px] rounded-full',
                        mainAsset.tokenData.symbol === 'Collectibles' &&
                          'flex items-center justify-center border-2 border-neutral-300',
                      )}
                    >
                      {mainAsset.tokenData.symbol === 'Collectibles' ? (
                        <Icon name="Card" size={36} className="text-black" />
                      ) : (
                        <TokenLogo
                          symbol={mainAsset.tokenData.symbol}
                          imageUrl={mainAsset.tokenData.imageUrl}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={classes(
                          'w-fit rounded-full bg-mint-200 px-1 text-xs font-medium text-mint-700',
                        )}
                      >
                        {mainAsset.donationCount} donation
                        {mainAsset.donationCount !== 1 && 's'}
                      </span>
                      <span
                        className={classes(
                          'flex items-center text-label1 text-black',
                        )}
                      >
                        {formatFiatValue(mainAsset.totalAmount)}{' '}
                        <span
                          className={classes('ml-2 text-body4 text-gray-300')}
                        >
                          {mainAsset.tokenData.symbol}
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                <table className="w-full table-auto border-collapse">
                  <tbody>
                    {otherAssets.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td className="flex items-center gap-2 py-3">
                            <div
                              className={classes(
                                'relative size-6 rounded-full text-black',
                                item.tokenData.symbol === 'Collectibles' &&
                                  'flex items-center justify-center border-2 border-neutral-300',
                              )}
                            >
                              {item.tokenData.symbol === 'Collectibles' ? (
                                <Icon
                                  name="Card"
                                  size={36}
                                  className="text-black"
                                />
                              ) : (
                                <TokenLogo
                                  symbol={item.tokenData.symbol}
                                  imageUrl={item.tokenData.imageUrl}
                                />
                              )}
                            </div>
                            <span className="text-sm text-gray-300">
                              {item.tokenData.name ?? item.tokenData.symbol}{' '}
                            </span>
                          </td>
                          <td>
                            <span
                              className={classes(
                                'w-fit rounded-full bg-mint-200 px-1 py-0.5 text-xs font-medium text-mint-700',
                              )}
                            >
                              {item.donationCount} donation
                              {item.donationCount !== 1 && 's'}
                            </span>
                          </td>
                          <td className="text-right align-middle text-sm font-medium text-black">
                            {item.tokenData.symbol === 'Collectibles' &&
                            item.totalAmount === 0 ? (
                              <div className="inline-flex items-center gap-1">
                                <span>–</span>
                                <TooltipProvider delayDuration={400}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Icon
                                        className="text-neutral-600"
                                        name="HelpCircle"
                                        size={12}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black text-center text-white">
                                      <p>
                                        This collectible had no market offers at
                                        the time of receiving
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ) : (
                              formatFiatValue(item.totalAmount)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Add skeleton rows to fill up to 3 total rows */}
                    {Array.from({
                      length: Math.max(0, 3 - otherAssets.length),
                    }).map((_, index) => {
                      return (
                        <tr
                          key={`skeleton-${index}`}
                          className="h-[49px] border-b border-gray-200 last:border-b-0"
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="size-6 shrink-0 rounded-full bg-neutral-100" />
                              <div className="mr-5 h-[10px] max-w-[90px] flex-1 rounded-md bg-neutral-100" />
                            </div>
                          </td>
                          <td>
                            <div className="mr-auto h-[10px] w-[80px] rounded-md bg-neutral-100" />
                          </td>
                          <td>
                            <div className="ml-auto h-[10px] w-[49px] rounded-md bg-neutral-100" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          <Card className="col-span-3">
            <CardBody>
              <div className="flex w-full flex-col gap-y-3 pr-5 pt-1">
                {sortedDonations.map((donation) => {
                  return (
                    <DonateHistoryItem
                      donation={donation}
                      key={donation.transactionHash}
                      canReplay
                    />
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
          <Card className="col-span-3 p-0">
            <div className="relative h-[224px] overflow-hidden rounded-2xl bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)]">
              <img
                alt="lines"
                src={backgroundLines2.src}
                className="absolute w-full opacity-40"
              />
              <img
                alt="idriss stream"
                src={IDRISS_SCENE_STREAM_4.src}
                className="absolute top-[-103px] w-full"
              />
              <img
                alt="idriss coin"
                src={IDRISS_COIN.src}
                className="absolute left-1/2 top-1 w-[198px] -translate-x-1/2"
              />
            </div>
          </Card>
          <Card className="col-span-3">
            <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
              <span
                className={classes(
                  'text-center text-heading6 uppercase text-neutral-900',
                )}
              >
                No donations yet
              </span>
              <span
                className={classes(
                  'mx-8 text-center text-display5 uppercase gradient-text',
                )}
              >
                Share your page to get your first donation
              </span>
              <CopyButton
                text={creator?.donationUrl ?? ''}
                disabled={!creator?.donationUrl}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
