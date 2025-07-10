import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { BalanceTableItem, TOKEN } from '@idriss-xyz/constants';

import { IDRISS_SCENE_STREAM_4 } from '@/assets';

import { BalanceTable } from './balance-table';

export const balanceStats: BalanceTableItem[] = [
  {
    totalAmount: 1250,
    totalValue: 1250,
    token: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      symbol: 'DAI',
      imageUrl: TOKEN.DAI.logo,
      network: 'Ethereum',
      decimals: 18,
      name: 'Dai Stablecoin',
    },
  },
  {
    totalAmount: 0.5,
    totalValue: 1500,
    token: {
      address: '0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      imageUrl: TOKEN.ETHEREUM.logo,
      network: 'Ethereum',
      decimals: 18,
      name: 'Wrapped Ether',
    },
  },
  {
    totalAmount: 100,
    totalValue: 100,
    token: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      imageUrl: TOKEN.USDC.logo,
      network: 'Ethereum',
      decimals: 6,
      name: 'USD Coin',
    },
  },
  {
    totalAmount: 3,
    totalValue: 9000,
    token: {
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'RONIN',
      imageUrl: TOKEN.RONIN.logo,
      network: 'Ronin',
      decimals: 18,
      name: 'Ronin',
    },
  },
  {
    totalAmount: 50,
    totalValue: 50,
    token: {
      address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
      symbol: 'GHST',
      imageUrl: TOKEN.AAVEGOTCHI.logo,
      network: 'Ethereum',
      decimals: 18,
      name: 'Aavegotchi',
    },
  },
  {
    totalAmount: 1.2,
    totalValue: 2400,
    token: {
      address: '0xC011A72400E58ecD99Ee497CF89E3775d4bd732F',
      symbol: 'DEGEN',
      imageUrl: TOKEN.DEGEN.logo,
      network: 'Ethereum',
      decimals: 18,
      name: 'Degen',
    },
  },
  {
    totalAmount: 5,
    totalValue: 500,
    token: {
      address: '0x7d1Afa7B718fb893dB30A3abc0Cfc608AaCfeBB0',
      symbol: 'PENGU',
      imageUrl: TOKEN.PENGU.logo,
      network: 'Polygon',
      decimals: 18,
      name: 'Pudgy Penguins',
    },
  },
  {
    totalAmount: 20,
    totalValue: 40,
    token: {
      address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc',
      symbol: TOKEN.IDRISS.symbol,
      imageUrl: TOKEN.IDRISS.logo,
      network: 'Base',
      decimals: 18,
      name: TOKEN.IDRISS.name,
    },
  },
  {
    totalAmount: 0.8,
    totalValue: 1600,
    token: {
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      symbol: TOKEN.YGG.symbol,
      imageUrl: TOKEN.YGG.logo,
      network: 'Ethereum',
      decimals: 18,
      name: TOKEN.YGG.name,
    },
  },
];

// ts-unused-exports:disable-next-line
export default function EarningsBalance() {
  const { balance } = { balance: 1250 }; // TODO: Replace with user address and balance
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-3 p-0">
        <div className="relative h-[224px] overflow-hidden rounded-2xl">
          <img
            alt="idriss stream"
            src={IDRISS_SCENE_STREAM_4.src}
            className="absolute top-[-165px] w-full"
          />
          <div className="flex flex-col items-center gap-2 px-4 py-6">
            <div className="flex flex-col items-center">
              <h4 className="text-heading4">Available balance</h4>
              <h2 className="text-heading2 gradient-text">${balance}</h2>
            </div>
            <Button
              intent="primary"
              size="small"
              className="uppercase"
              prefixIconName="ArrowDownFromLine"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Card>
      {balance > 0 ? (
        <Card className="col-span-3 p-0">
          <BalanceTable data={balanceStats} />
        </Card>
      ) : (
        <>
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
