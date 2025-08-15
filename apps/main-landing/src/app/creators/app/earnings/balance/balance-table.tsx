'use client';
import { BalanceTableItem } from '@idriss-xyz/constants';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { formatFiatValue, formatTokenValue } from '@idriss-xyz/utils';

import { TokenLogo } from '../stats-and-history/token-logo';

export function BalanceTable({
  data,
  setSelectedToken,
  setIsWithdrawModalOpen,
}: {
  data: BalanceTableItem[];
  setSelectedToken: (tokenSymbol: string) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
}) {
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
        return `${formatTokenValue(item.totalAmount)} ${item.token.symbol}`;
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
        return `${formatFiatValue(item.totalValue)}` || 0;
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
              setSelectedToken(item.token.symbol);
              setIsWithdrawModalOpen(true);
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
