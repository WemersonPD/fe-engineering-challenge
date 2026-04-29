import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
}

export default function Table<T extends { id: number }>({
  columns,
  data,
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
            {columns.map((col) => (
              <th key={String(col.key)} className="sticky top-0 z-10 bg-gray-50 px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.id}
              className="bg-white hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
