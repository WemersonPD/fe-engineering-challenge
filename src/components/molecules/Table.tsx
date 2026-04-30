import { type ReactNode } from 'react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '../../utils/cn'

export interface Column<T> {
  key: string
  header: string
  sortKey?: string
  render?: (row: T) => ReactNode
}

interface Sort {
  field: string
  order: 'asc' | 'desc'
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  sort?: Sort
  onSort?: (sortKey: string) => void
  className?: string
}

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return <ChevronUpDownIcon className="size-3 text-gray-300" />

  if (asc) return <ChevronUpIcon className="size-3 text-gray-700" />

  return <ChevronDownIcon className="size-3 text-gray-700" />
}

export default function Table<T extends { id: number }>({
  columns,
  data,
  sort,
  onSort,
  className,
}: TableProps<T>) {
  return (
    <div
      className={cn(
        'flex-1 min-h-0 overflow-auto rounded-xl border border-gray-200',
        className,
      )}
    >
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            {columns.map((col) => {
              const sortable = !!col.sortKey && !!onSort
              const active = sort?.field === col.sortKey

              return (
                <th
                  key={col.key}
                  className={cn(
                    'sticky top-0 z-10 bg-gray-50 px-4 py-3 font-medium whitespace-nowrap',
                    sortable &&
                      'cursor-pointer select-none hover:text-gray-700',
                  )}
                  onClick={sortable ? () => onSort!(col.sortKey!) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortable && (
                      <SortIcon active={active} asc={sort?.order === 'asc'} />
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.id}
              className="h-18 bg-white hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
