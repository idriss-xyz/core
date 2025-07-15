'use client';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { BalanceTableItem } from '@idriss-xyz/constants';
import { formatNumber } from '@idriss-xyz/utils';

import { TokenLogo } from '../stats/token-logo';

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
          <div className="bg-gray-100 relative size-8 rounded-full">
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
    accessor: (_) => {
      return (
        <IconButton
          intent="tertiary"
          size="medium"
          iconName="ArrowDownFromLine"
          onClick={() => {
            return console.log('To be implemented'); // TODO: Implement download
          }}
        />
      );
    },
    className: 'flex justify-end',
  },
];

export function BalanceTable({ data }: { data: BalanceTableItem[] }) {
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
