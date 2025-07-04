'use client';
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@idriss-xyz/ui/charts';
import { Bar, BarChart, XAxis } from 'recharts';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import {
  ECHELON_PRIME_LOGO,
  ETHEREUM_LOGO,
  USDC_LOGO,
} from '@idriss-xyz/constants';
import Image from 'next/image';
import { Button } from '@idriss-xyz/ui/button';

import { IDRISS_COIN, IDRISS_ICON_CIRCLE, IDRISS_SCENE_STREAM_4 } from '@/assets';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { DonateHistoryItem } from '@/app/creators/donate/components/donate-history/donate-history-item';

const chartData = [
  { month: 'January', donations: 110 },
  { month: 'February', donations: 92 },
  { month: 'March', donations: 45 },
  { month: 'April', donations: 260 },
  { month: 'May', donations: 100 },
  { month: 'June', donations: 100 },
  { month: 'July', donations: 100 },
  { month: 'August', donations: 100 },
  { month: 'September', donations: 100 },
  { month: 'October', donations: 100 },
  { month: 'November', donations: 100 },
  { month: 'December', donations: 100 },
];

const chartConfig = {
  donations: {
    label: 'Donations',
    color: '#f3f4f6',
  },
} satisfies ChartConfig;

const earningsByAsset = [
  {
    name: 'Ethereum',
    icon: ETHEREUM_LOGO, // Replace with icon url
    donations: 3,
    amount: '$270',
  },
  {
    name: 'Echelon Prime',
    icon: ECHELON_PRIME_LOGO,
    donations: 3,
    amount: '$150',
  },
  {
    name: 'USDC',
    icon: USDC_LOGO,
    donations: 3,
    amount: '$85',
  },
];

// ts-unused-exports:disable-next-line
export default function EarningsStats() {
  const tipHistoryQuery = useGetTipHistory({
    address: '0x7D716741D2c37925e5E15123025400Be80ec796d',
  });
  const donations = tipHistoryQuery.data?.donations ?? [];
  const sortedDonations = [...donations].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="grid grid-cols-3 gap-4">

      { sortedDonations.length > 0 ? (
        <>
          <Card className="col-span-1">
            <CardHeader>Transactions</CardHeader>
            <CardBody>
              <div className="relative">
                <div className="mx-14 my-4 flex items-center justify-center p-6">
                  <img src={IDRISS_COIN.src} alt="coin" />
                </div>
                <span className="pointer-events-none absolute left-6 top-16 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-black">
                  <Icon
                    size={24}
                    name="BadgeDollarSign"
                    className="mr-1 rounded-full bg-mint-600 p-1 text-white"
                  />
                  32 donations
                </span>
                <span className="pointer-events-none absolute right-8 top-8 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-black">
                  <Icon
                    size={24}
                    name="Trophy"
                    className="mr-1 rounded-full bg-mint-600 p-1 text-white"
                  />
                  5 donors
                </span>
                <span className="pointer-events-none absolute bottom-8 right-8 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-medium text-black">
                  <Icon
                    size={24}
                    name="TrendingUp"
                    className="mr-1 rounded-full bg-mint-600 p-1 text-white"
                  />
                  $100 largest donation
                </span>
              </div>
            </CardBody>
          </Card>
          <Card className="col-span-1 space-y-4">
            <CardHeader>Total earnings</CardHeader>
            <CardBody>
              <span className="text-heading3 text-black">$920</span>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
                          return `$${value.toLocaleString()}`;
                        }}
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
            <CardHeader>Earnings by asset</CardHeader>
            <CardBody>
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={IDRISS_ICON_CIRCLE.src}
                    alt="Logo"
                    width={48}
                    height={48}
                    className={classes('size-[70px] rounded-full')}
                  />
                  <div className="flex flex-col">
                    <span className="w-fit rounded-full bg-mint-200 px-1 py-0.5 text-xs font-medium text-mint-700">
                      12 donations
                    </span>
                    <span className="flex items-center text-xl font-semibold text-black">
                      $320{' '}
                      <span className="ml-2 text-sm font-medium text-gray-300">
                        IDRISS
                      </span>
                    </span>
                  </div>
                </div>

                <table className="w-full table-auto border-collapse">
                  <tbody>
                    {earningsByAsset.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td className="flex items-center gap-2 py-3">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={24}
                              height={24}
                            />
                            <span className="text-sm text-gray-300">
                              {item.name}
                            </span>
                          </td>
                          <td>
                            <span className="w-fit rounded-full bg-mint-200 px-1 py-0.5 text-xs font-medium text-mint-700">
                              {item.donations} donations
                            </span>
                          </td>
                          <td className="text-right align-middle text-sm font-medium text-black">
                            {item.amount}
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
            <div className='h-[224px] relative overflow-hidden'>
              <img
                alt="idriss stream"
                src={IDRISS_SCENE_STREAM_4.src}
                className="absolute w-full top-[-112px] "/>
              <img
                alt="idriss coin"
                src={IDRISS_COIN.src}
                className="w-[198px] mx-auto "/>
            </div>
          </Card>
          <Card className="col-span-3">
            <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
                  <span className="text-center text-heading6 uppercase text-neutral-900">
                    No donations yet
                  </span>
                  <span className="mx-8 text-center text-display5 uppercase gradient-text">
                    Share your page to get your first donation
                  </span>
                  <Button
                    size="medium"
                    intent="secondary"
                    onClick={() => {
                      return console.log('Not implemented yet');
                    }} // TODO: Add functionality
                    suffixIconName="IdrissArrowRight"
                    className="uppercase"
                  >
                    Copy link
                  </Button>
                </div>
          </Card>
        </>
      )}
    </div>
  );
}
