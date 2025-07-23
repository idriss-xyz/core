'use client';
import { useSendTransaction } from '@privy-io/react-auth';
import { BalanceTableItem, ERC20_ABI } from '@idriss-xyz/constants';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { formatNumber } from '@idriss-xyz/utils';
import { encodeFunctionData, Hex, parseUnits } from 'viem';

import { TokenLogo } from '../stats/token-logo';

export function BalanceTable({
  data,
  userAddress,
}: {
  data: BalanceTableItem[];
  userAddress: Hex | undefined;
}) {
  const { sendTransaction } = useSendTransaction();

  const handleWithdraw = async (item: BalanceTableItem) => {
    if (!userAddress) {
      console.error('User address not found');
      return;
    }

    const amount = parseUnits(item.totalAmount.toString(), item.token.decimals);

    const txData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [userAddress, amount],
    });

    try {
      const tx = await sendTransaction(
        {
          to: item.token.address,
          chainId: 8453,
          data: txData,
          value: '0',
        },
        {
          uiOptions: {
            showWalletUIs: false,
          },
        },
      );
      console.log('Transaction sent:', tx.hash);
    } catch (error) {
      console.error('Failed to send transaction', error);
    }
  };

  const columns: ColumnDefinition<BalanceTableItem>[] = [
    {
      id: 'rank',
      name: '#',
      accessor: (_, index) => {
        return index + 1;
      },
    },
    {
      id: 'token',
      name: 'Token',
      accessor: (item) => {
        return (
          <div className="flex items-center gap-2">
            <div className="relative size-8 rounded-full bg-gray-200">
              <TokenLogo
                symbol={item.token.symbol ?? ''}
                imageUrl={item.token.imageUrl}
              />
            </div>
            <span>{item.token.symbol ?? 'UNKNOWN SYMBOL'}</span>
          </div>
        );
      },
    },
    {
      id: 'totalAmount',
      name: 'Amount',
      accessor: (item) => {
        return `${formatNumber(item.totalAmount, 2)} ${item.token.symbol}`;
      },
      sortable: true,
      sortFunction: (a, b) => {
        return a.totalAmount - b.totalAmount;
      },
    },
    {
      id: 'totalValue',
      name: 'Value',
      accessor: (item) => {
        return `$${formatNumber(item.totalValue, 2)}` || 0;
      },
      sortable: true,
      sortFunction: (a, b) => {
        return (a.totalValue ?? 0) - (b.totalValue ?? 0);
      },
    },
    {
      id: 'actions',
      name: 'Action',
      accessor: (item) => {
        return (
          <IconButton
            intent="tertiary"
            size="medium"
            iconName="ArrowDownFromLine"
            onClick={() => {
              return handleWithdraw(item);
            }}
          />
        );
      },
      className: 'flex justify-center',
      headerClassName: 'justify-center',
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      keyExtractor={(item) => {
        return `${item.token.address}${item.totalAmount}`;
      }}
      emptyState={
        <div className="py-8 text-center">
          <p className="text-heading6 text-neutral-500">No donors yet</p>
        </div>
      }
    />
  );
}
