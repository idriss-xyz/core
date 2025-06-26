'use client';
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@idriss-xyz/ui/charts';
import { Bar, BarChart, XAxis } from 'recharts';

import { IDRISS_COIN, IDRISS_ICON_CIRCLE } from '@/assets';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import {
  ECHELON_PRIME_LOGO,
  ETHEREUM_LOGO,
  TOKEN,
  USDC_LOGO,
} from '@idriss-xyz/constants';
import Image from 'next/image';
import { DonateHistoryItem } from '../donate/components/donate-history/donate-history-item';
import { Hex } from 'viem';

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

const donations = [
  {
    toAddress: '0xAbC1234567890abcdefABC1234567890abcdefAB' as Hex,
    network: 'ETHEREUM',
    comment: 'Keep up the great work!',
    fromAddress: '0xFfF9876543210fedcbaFFF9876543210fedcbaFf' as Hex,
    timestamp: 1750938428,
    amountRaw: '300000000000000000000',
    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Hex,
    tradeValue: 300,
    token: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Hex,
      symbol: 'DAI',
      network: 'ETHEREUM',
      decimals: 18,
      imageUrl: TOKEN.DAI.logo,
    },
    toUser: {
      address: '0xAbC1234567890abcdefABC1234567890abcdefAB' as Hex,
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      displayName: 'DevFund',
    },
    transactionHash:
      '0xaaaabbbbcccc111122223333444455556666777788889999aaaabbbbccccdddd' as Hex,
    fromUser: {
      address: '0xFfF9876543210fedcbaFFF9876543210fedcbaFf' as Hex,
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      displayName: 'Alice',
    },
  },
  {
    toAddress: '0x1111222233334444555566667777888899990000' as Hex,
    network: 'BASE',
    fromAddress: '0x9999000011112222333344445555666677778888' as Hex,
    timestamp: 1750938913,
    amountRaw: '5000000000000000000000',
    tokenAddress: '0x0000000000000000000000000000000000001010' as Hex,
    tradeValue: 3,
    token: {
      address: '0x0000000000000000000000000000000000001010' as Hex,
      symbol: 'IDRISS',
      network: 'BASE',
      decimals: 18,
      imageUrl: TOKEN.IDRISS.logo,
    },
    toUser: {
      address: '0x1111222233334444555566667777888899990000' as Hex,
      displayName: 'PolygonDAO',
    },
    transactionHash:
      '0x1111111122222222333333334444444455555555666666667777777788888888' as Hex,
    fromUser: {
      address: '0x9999000011112222333344445555666677778888' as Hex,
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
    },
  },
];

const sortedDonations = [...donations].sort((a, b) => {
  return b.timestamp - a.timestamp;
});

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <h1 className="col-span-3 mb-4 text-heading3">Earnings</h1>
      <Card className="col-span-1">
        <CardHeader>Transactions</CardHeader>
        <CardBody>
          <div className="relative">
            <div className="mx-14 my-4 flex items-center justify-center p-6">
              <img src={IDRISS_COIN.src} alt="coin" />
            </div>
            <span className="pointer-events-none absolute left-6 top-16 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-[500] text-black">
              <Icon
                size={24}
                name="BadgeDollarSign"
                className="mr-1 rounded-full bg-mint-600 p-1 text-white"
              />
              32 donations
            </span>
            <span className="pointer-events-none absolute right-8 top-8 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-[500] text-black">
              <Icon
                size={24}
                name="Trophy"
                className="mr-1 rounded-full bg-mint-600 p-1 text-white"
              />
              5 donors
            </span>
            <span className="pointer-events-none absolute bottom-8 right-8 flex items-center justify-center rounded-full bg-mint-200 px-2 py-1.5 font-[500] text-black">
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
                tickFormatter={(value) =>
                  typeof value === 'string' ? value.slice(0, 3) : value
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    hideLabel
                    hideValueName
                    formatter={(value) => `$${value.toLocaleString()}`}
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
                  <span className="text-gray-500 ml-2 text-sm font-[500]">
                    IDRISS
                  </span>
                </span>
              </div>
            </div>

            <table className="w-full table-auto border-collapse">
              <tbody>
                {earningsByAsset.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="flex items-center gap-2 py-3">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                      />
                      <span className="text-gray-800 text-sm">{item.name}</span>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <Card className="col-span-3">
        <CardBody>
          <div className="flex w-full flex-col gap-y-3 pr-5 pt-1">
            {sortedDonations.length > 0 ? (
              sortedDonations.map((donation) => {
                return (
                  <DonateHistoryItem
                    donation={donation}
                    key={donation.transactionHash}
                  />
                );
              })
            ) : (
              <p>This address has not received any donations</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
