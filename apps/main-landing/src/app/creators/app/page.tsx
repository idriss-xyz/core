'use client'
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@idriss-xyz/ui/charts';
import { Bar, BarChart, XAxis } from "recharts"

import { IDRISS_COIN, IDRISS_ICON_CIRCLE } from '@/assets';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';
import { ECHELON_PRIME_LOGO, ETHEREUM_LOGO, USDC_LOGO } from '@idriss-xyz/constants';
import Image from 'next/image';

const chartData = [
  { month: "January", donations: 110 },
  { month: "February", donations: 92 },
  { month: "March", donations: 45 },
  { month: "April", donations: 260 },
  { month: "May", donations: 100 },
  { month: "June", donations: 100 },
  { month: "July", donations: 100 },
  { month: "August", donations: 100 },
  { month: "September", donations: 100 },
  { month: "October", donations: 100 },
  { month: "November", donations: 100 },
  { month: "December", donations: 100 },
]

const chartConfig = {
  donations: {
    label: "Donations",
    color: "#f3f4f6",
  },
} satisfies ChartConfig


const donations = [
  {
    name: "Ethereum",
    icon: ETHEREUM_LOGO, // Replace with icon url
    donations: 3,
    amount: "$270",
  },
  {
    name: "Echelon Prime",
    icon: ECHELON_PRIME_LOGO,
    donations: 3,
    amount: "$150",
  },
  {
    name: "USDC",
    icon: USDC_LOGO,
    donations: 3,
    amount: "$85",
  },
];

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <h1 className="col-span-3 mb-4 text-heading3">Earnings</h1>
      <Card className="col-span-1">
        <CardHeader>Transactions</CardHeader>
        <CardBody>
          <div className='relative'>
            <div className="flex items-center justify-center mx-14 my-4 p-6">
              <img src={IDRISS_COIN.src} alt="coin" />
            </div>
            <span className='flex justify-center items-center absolute px-2 py-1.5 font-[500] text-black bg-mint-200 rounded-full pointer-events-none top-16 left-6'>
              <Icon size={24} name='BadgeDollarSign' className='mr-1 bg-mint-600 rounded-full text-white p-1' />
              32 donations
            </span>
            <span className='flex justify-center items-center absolute px-2 py-1.5 font-[500] text-black bg-mint-200 rounded-full pointer-events-none top-8 right-8'>
              <Icon size={24} name='Trophy' className='mr-1 bg-mint-600 rounded-full text-white p-1' />
              5 donors
            </span>
            <span className='flex justify-center items-center absolute px-2 py-1.5 font-[500] text-black bg-mint-200 rounded-full pointer-events-none bottom-8 right-8'>
              <Icon size={24} name='TrendingUp' className='mr-1 bg-mint-600 rounded-full text-white p-1' />
              $100 largest donation
            </span>
          </div>
        </CardBody>
      </Card>
      <Card className="col-span-1 space-y-4">
        <CardHeader>Total earnings</CardHeader>
        <CardBody>
          <span className='text-heading3 text-black'>$920</span>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value }
              />
              <ChartTooltip content={<ChartTooltipContent hideIndicator hideLabel hideValueName formatter={(value) => `$${value.toLocaleString()}`}/>} />
              <Bar dataKey="donations" fill="var(--color-donations)" radius={4} activeBar={{ fill: '#E7FED8' }}/>
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
                <span className="w-fit rounded-full bg-mint-200 py-0.5 px-1 text-xs font-medium text-mint-700">
                  12 donations
                </span>
                <span className="text-xl font-semibold flex items-center text-black">$320 <span className="text-sm text-gray-500 font-[500] ml-2">IDRISS</span></span>
              </div>
            </div>

            <table className="w-full table-auto border-collapse">
              <tbody>
                {donations.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                    <td className="py-3 flex items-center gap-2">
                      <Image src={item.icon} alt={item.name} width={24} height={24} />
                      <span className="text-sm text-gray-800">{item.name}</span>
                    </td>
                    <td>
                      <span className="w-fit rounded-full bg-mint-200 py-0.5 px-1 text-xs font-medium text-mint-700">
                        {item.donations} donations
                      </span>
                    </td>
                    <td className="text-right text-sm font-medium text-black align-middle ">
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
        <CardBody>history</CardBody>
      </Card>
    </div>
  );
}
