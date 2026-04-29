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
  render?: (value: unknown, row: T) => ReactNode
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
              const isSortable = !!col.sortKey && !!onSort
              const isActive = sort?.field === col.sortKey
              const isAsc = isActive && sort?.order === 'asc'

              return (
                <th
                  key={col.key}
                  className={cn(
                    'sticky top-0 z-10 bg-gray-50 px-4 py-3 font-medium whitespace-nowrap',
                    isSortable &&
                      'cursor-pointer select-none hover:text-gray-700',
                  )}
                  onClick={isSortable ? () => onSort!(col.sortKey!) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {isSortable &&
                      (isActive ? (
                        isAsc ? (
                          <ChevronUpIcon className="size-3 text-gray-700" />
                        ) : (
                          <ChevronDownIcon className="size-3 text-gray-700" />
                        )
                      ) : (
                        <ChevronUpDownIcon className="size-3 text-gray-300" />
                      ))}
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
              {columns.map((col) => {
                const value = (row as Record<string, unknown>)[col.key]
                return (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(value, row) : String(value ?? '')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
