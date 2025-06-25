'use client'
import { Card, CardHeader, CardBody } from '@idriss-xyz/ui/card';
import { ChartConfig, ChartContainer } from '@idriss-xyz/ui/charts';
import { Bar, BarChart } from "recharts"

import { IDRISS_COIN } from '@/assets';
import { Icon } from '@idriss-xyz/ui/icon';

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

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
      <Card className="col-span-1">
        <CardHeader>Total earnings</CardHeader>
        <CardBody>
          <span className='text-heading3 text-black mb-2'>$920</span>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardBody>
      </Card>
      <Card className="col-span-1">
        <CardHeader>Earnings by asset</CardHeader>
      </Card>
      <Card className="col-span-3">
        <CardBody>history</CardBody>
      </Card>
    </div>
  );
}
