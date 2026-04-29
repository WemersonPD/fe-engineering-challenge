import { BarsArrowUpIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline'
import Card from '../../molecules/Card'
import Dropdown from '../../atoms/Dropdown'
import type { SortField } from '../../../types/filters'
import type { ViewProps } from './types'

const SORT_OPTIONS = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'types', label: 'Type' },
  { value: 'timestamp', label: 'Caught date' },
]

export default function GridView({
  pokemon,
  caught,
  sort,
  onSortChange,
  onCatch,
  onRelease,
}: ViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Dropdown
          options={SORT_OPTIONS}
          value={sort.field}
          onChange={(value) =>
            onSortChange({ ...sort, field: value as SortField })
          }
        />
        <button
          type="button"
          aria-label={sort.order === 'asc' ? 'Sort ascending' : 'Sort descending'}
          onClick={() =>
            onSortChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })
          }
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          {sort.order === 'asc'
            ? <BarsArrowUpIcon className="size-4" />
            : <BarsArrowDownIcon className="size-4" />
          }
        </button>
      </div>

      <ul className="flex flex-wrap gap-4" aria-label="Pokémon list">
        {pokemon.map((p) => (
          <li key={p.id}>
            <Card
              pokemon={p}
              caught={caught.get(p.id)}
              onCatch={onCatch}
              onRelease={onRelease}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
