'use client';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { BalanceTableItem } from '@idriss-xyz/constants';

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
          {item.token.imageUrl && (
            <img
              src={item.token.imageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          )}
          <span>{item.token.symbol ?? 'UNKNOWN SYMBOL'}</span>
        </div>
      );
    },
  },
  {
    id: 'totalAmount',
    name: 'Amount',
    accessor: (item) => {
      return `${item.totalAmount.toFixed(2)} ${item.token.symbol}`;
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
      return `$${item.totalValue}` || 0;
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
          size="small"
          iconName="ArrowDownFromLine"
          onClick={() => {
            return console.log('To be implemented'); // TODO: Implement download
          }}
        />
      );
    },
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
