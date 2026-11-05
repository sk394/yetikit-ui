'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type DataTableColumn<T> = {
  /** Unique key. If `accessor` is omitted, `row[key]` is used. */
  key: string;
  header: React.ReactNode;
  /** Read the raw value used for sorting and searching. */
  accessor?: (row: T) => unknown;
  /** Custom cell renderer. Defaults to the raw value. */
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Rows per page. Set to 0 to disable pagination. */
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  getRowId?: (row: T, index: number) => string | number;
  emptyMessage?: React.ReactNode;
  className?: string;
};

type SortState = { key: string; direction: 'asc' | 'desc' } | null;

function getValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.key];
}

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search…',
  getRowId,
  emptyMessage = 'No results.',
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<SortState>(null);
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const value = getValue(row, column);
        return value != null && String(value).toLowerCase().includes(q);
      }),
    );
  }, [data, columns, query]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const result = compare(getValue(a, column), getValue(b, column));
      return sort.direction === 'asc' ? result : -result;
    });
    return copy;
  }, [filtered, sort, columns]);

  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount - 1);
  const rows = pageSize > 0 ? sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize) : sorted;

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  };

  return (
    <div data-slot="data-table" className={cn('flex flex-col gap-3', className)}>
      {searchable ? (
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={searchPlaceholder}
            aria-label="Search table"
            className="pl-8"
          />
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                const SortIcon = !isSorted ? ArrowUpDown : sort?.direction === 'asc' ? ArrowUp : ArrowDown;
                return (
                  <TableHead
                    key={column.key}
                    className={column.className}
                    aria-sort={
                      column.sortable
                        ? isSorted
                          ? sort?.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                        : undefined
                    }
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="-ml-2 inline-flex h-7 items-center gap-1 rounded-md px-2 font-medium hover:bg-muted"
                      >
                        {column.header}
                        <SortIcon className={cn('size-3.5', !isSorted && 'opacity-50')} aria-hidden />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={getRowId ? getRowId(row, index) : index}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell ? column.cell(row) : String(getValue(row, column) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageSize > 0 ? (
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {sorted.length} row{sorted.length === 1 ? '' : 's'}
            {query ? ` matching "${query}"` : ''}
          </span>
          <div className="flex items-center gap-2">
            <span>
              Page {currentPage + 1} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DataTable };
