'use client';
import { ReactNode, useState } from 'react';

import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

// Sort direction types
export type SortDirection = 'asc' | 'desc' | null;

// Column definition type
export type ColumnDefinition<T> = {
  id: string;
  name: ReactNode;
  accessor: (item: T, index: number) => ReactNode;
  sortable?: boolean;
  sortFunction?: (a: T, b: T) => number;
  className?: string;
  headerClassName?: string;
};

// Sort state type
type SortState = {
  columnId: string;
  direction: SortDirection;
};

type TableProperties<T> = {
  columns: ColumnDefinition<T>[];
  data: T[];
  showHeaders?: boolean;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  keyExtractor: (item: T) => string;
  emptyState?: ReactNode;
};

export function Table<T>({
  columns,
  data,
  showHeaders = true,
  className,
  rowClassName,
  keyExtractor,
  emptyState,
}: TableProperties<T>) {
  // State for sorting
  const [sortState, setSortState] = useState<SortState | null>(null);

  // Function to handle sort click
  const handleSort = (columnId: string) => {
    setSortState((previousSortState) => {
      // If clicking the same column that's already sorted
      if (previousSortState?.columnId === columnId) {
        // Cycle through: desc -> asc -> null
        return previousSortState.direction === 'desc'
          ? { columnId, direction: 'asc' }
          : null; // Remove sorting
      } else {
        // New column sort, start with desc
        return { columnId, direction: 'desc' };
      }
    });
  };

  // Function to get sort direction for a column
  const getSortDirection = (columnId: string): SortDirection => {
    return sortState?.columnId === columnId ? sortState.direction : null;
  };

  // Function to sort data
  const getSortedData = () => {
    if (!sortState) return data;

    const { columnId, direction } = sortState;
    const column = columns.find((col) => {
      return col.id === columnId;
    });

    if (!column?.sortFunction || direction === null) return data;

    return [...data].sort((a, b) => {
      if (!column?.sortFunction) return 0;
      const comparison = column.sortFunction(a, b);
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  // Get sorted data
  const sortedData = getSortedData();

  // Determine row class name function
  const getRowClassName = (item: T, index: number) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(item, index);
    }
    return rowClassName ?? '';
  };

  return (
    <table className={classes('w-full table-auto border-collapse', className)}>
      {showHeaders && (
        <thead className="bg-neutral-100/80 text-label6 text-neutral-800">
          <tr>
            {columns.map((column) => {
              return (
                <th
                  key={column.id}
                  scope="col"
                  className={classes(
                    'h-[44px] px-4 font-medium',
                    column.sortable &&
                      'cursor-pointer select-none hover:text-mint-600',
                    column.className,
                  )}
                  onClick={
                    column.sortable
                      ? () => {
                          return handleSort(column.id);
                        }
                      : undefined
                  }
                >
                  {typeof column.name === 'string' ? (
                    <div
                      className={classes(
                        'flex items-center gap-1',
                        column.headerClassName,
                      )}
                    >
                      {column.name}
                      {column.sortable && (
                        <div className="w-4">
                          {getSortDirection(column.id) === 'desc' && (
                            <Icon name="ArrowDown" size={16} />
                          )}
                          {getSortDirection(column.id) === 'asc' && (
                            <Icon name="ArrowUp" size={16} />
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    column.name
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody>
        {sortedData.length > 0
          ? sortedData.map((item, index) => {
              return (
                <tr
                  key={keyExtractor(item)}
                  className={classes(
                    'border-b text-body5',
                    getRowClassName(item, index),
                  )}
                >
                  {columns.map((column) => {
                    return (
                      <td
                        key={column.id}
                        className={classes('h-[65px] px-4', column.className)}
                      >
                        {column.accessor(item, index)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          : emptyState && (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center">
                  {emptyState}
                </td>
              </tr>
            )}
      </tbody>
    </table>
  );
}
