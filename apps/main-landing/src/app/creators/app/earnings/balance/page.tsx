'use client';

import { Button } from '@idriss-xyz/ui/button';
import { Card } from '@idriss-xyz/ui/card';
import { BalanceTableItem } from '@idriss-xyz/constants';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';
import { formatNumber } from '@idriss-xyz/utils';

import { IDRISS_SCENE_STREAM_4 } from '@/assets';

import { useGetBalances } from '../commands/get-balances';

import { BalanceTable } from './balance-table';

// ts-unused-exports:disable-next-line
export default function EarningsBalance() {
  const { user, ready, authenticated } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

  const {
    data: balancesData,
    isLoading,
    isError,
  } = useGetBalances(
    { address },
    { enabled: ready && authenticated && !!address },
  );

  const totalUsdBalance = balancesData?.summary.totalUsdBalance ?? 0;
  const apiBalances = balancesData?.balances ?? [];

  // Transform the API data to match the format expected by the BalanceTable component.
  const tableData: BalanceTableItem[] = apiBalances.map((balance) => {
    return {
      totalAmount: Number(balance.balance),
      totalValue: balance.usdValue,
      token: {
        address: balance.address,
        symbol: balance.symbol,
        name: balance.name,
        imageUrl: balance.imageUrl ?? '',
        network: balance.network,
        decimals: balance.decimals,
      },
    };
  });

  const hasBalance = !isLoading && !isError && tableData.length > 0;

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
              <h2 className="text-heading2 gradient-text">
                ${formatNumber(totalUsdBalance, 2)}
              </h2>
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
      {hasBalance ? (
        <Card className="col-span-3 p-0">
          <BalanceTable data={tableData} />
        </Card>
      ) : (
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
              }}
              suffixIconName="IdrissArrowRight"
              className="uppercase"
            >
              Copy link
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
