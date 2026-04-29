import { useState, useEffect } from 'react'
import { BarsArrowUpIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline'
import Card from './components/molecules/Card'
import Dropdown from './components/atoms/Dropdown'
import FilterPanel, { type Filters } from './components/organisms/FilterPanel'
import Pagination from './components/molecules/Pagination'
import TopBar, { type ViewMode } from './components/molecules/TopBar'
import DefaultLayout from './components/templates/DefaultLayout'
import { useAllPokemon } from './hooks/useAllPokemon'
import { useDebounce } from './hooks/useDebounce'
import { usePokedex } from './hooks/usePokedex'
import type { Sort, SortField } from './types/filters'
import type { Pokemon } from './types/pokemon'

const SORT_OPTIONS = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'types', label: 'Type' },
  { value: 'timestamp', label: 'Caught date' },
]

const PAGE_SIZE = 8

const DEFAULT_FILTERS: Filters = {
  name: '',
  types: [],
  minHeight: 0,
  maxHeight: 20,
  caughtOnly: false,
  caughtAfter: '',
  caughtBefore: '',
}

const DEFAULT_SORT: Sort = {
  field: 'id',
  order: 'asc',
}

export default function App() {
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT)

  const pokedex = usePokedex()
  const debouncedFilters = useDebounce(filters)
  const { pokemon, loading, error } = useAllPokemon(
    debouncedFilters,
    sort,
    pokedex.caught,
  )

  useEffect(() => {
    const setInitialPage = () => {
      setPage(0)
    }

    setInitialPage()
  }, [filters, sort])

  const totalPages = Math.ceil(pokemon.length / PAGE_SIZE)
  const paginated = pokemon.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleCatch = (p: Pokemon) => {
    pokedex.catch({ id: p.id, name: p.name })
  }

  const renderContent = () => {
    if (loading)
      return (
        <p role="status" className="text-gray-500 text-sm">
          Loading Pokémon...
        </p>
      )

    if (error)
      return (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )

    if (viewMode === 'grid') {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Dropdown
              options={SORT_OPTIONS}
              value={sort.field}
              onChange={(value) => setSort({ ...sort, field: value as SortField })}
            />
            <button
              type="button"
              aria-label={sort.order === 'asc' ? 'Sort ascending' : 'Sort descending'}
              onClick={() => setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              {sort.order === 'asc'
                ? <BarsArrowUpIcon className="size-4" />
                : <BarsArrowDownIcon className="size-4" />
              }
            </button>
          </div>
          <ul className="flex flex-wrap gap-4" aria-label="Pokémon list">
            {paginated.map((p) => (
              <li key={p.id}>
                <Card
                  pokemon={p}
                  caught={pokedex.caught.get(p.id)}
                  onCatch={handleCatch}
                  onRelease={pokedex.release}
                />
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return <p>table</p>
  }

  return (
    <DefaultLayout
      topBar={
        <TopBar
          onViewModeChange={setViewMode}
          totalCount={pokemon.length}
          caughtCount={pokedex.caughtCount}
        />
      }
      sidebar={
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />
      }
      content={renderContent()}
      pagination={
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      }
    />
  )
}
