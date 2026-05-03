import { Link } from 'react-router-dom'
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
  selectedIds,
  onToggleSelect,
}: ViewProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
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
          aria-label={
            sort.order === 'asc' ? 'Sort ascending' : 'Sort descending'
          }
          onClick={() =>
            onSortChange({
              ...sort,
              order: sort.order === 'asc' ? 'desc' : 'asc',
            })
          }
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          {sort.order === 'asc' ? (
            <BarsArrowUpIcon className="size-4" />
          ) : (
            <BarsArrowDownIcon className="size-4" />
          )}
        </button>
      </div>

      <ul
        className="flex flex-wrap gap-4 justify-center"
        aria-label="Pokémon list"
      >
        {pokemon.map((p) => (
          <li id={`pokemon-${p.id}`} key={p.id} className="w-full sm:w-auto">
            <Link
              to={`/pokemon/${p.id}`}
              id={`pokemon-link-${p.id}`}
              key={`pokemon-link-${p.id}`}
              className="block w-full sm:w-auto"
            >
              <Card
                key={`pokemon-link-${p.id}`}
                pokemon={p}
                caught={caught.get(p.id)}
                onCatch={onCatch}
                onRelease={onRelease}
                selected={selectedIds.has(p.id)}
                onToggleSelect={onToggleSelect}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
