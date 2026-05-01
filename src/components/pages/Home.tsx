import { useState, useEffect, useMemo } from 'react'
import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/24/outline'
import FilterPanel, { type Filters } from '../organisms/FilterPanel'
import PokemonList from '../organisms/PokemonList'
import Pagination from '../molecules/Pagination'
import ViewToggle from '../atoms/ViewToggle'
import HomeLayout from '../templates/HomoLayout'
import { useAllPokemon } from '../../hooks/useAllPokemon'
import { useDebounce } from '../../hooks/useDebounce'
import { usePokedex } from '../../hooks/usePokedex'
import type { Sort } from '../../types/filters'
import type { Pokemon } from '../../types/pokemon'
import TopBar from '../molecules/TopBar'

type ViewMode = 'grid' | 'table'

const GRID_PAGE_SIZE = 8
const TABLE_PAGE_SIZE = 25

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

const VIEW_OPTIONS = [
  {
    value: 'grid' as ViewMode,
    label: 'Grid view',
    icon: <Squares2X2Icon className="w-4 h-4" />,
  },
  {
    value: 'table' as ViewMode,
    label: 'Table view',
    icon: <Bars3Icon className="w-4 h-4" />,
  },
]

export default function Home() {
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
    const restartPages = () => {
      setPage(0)
    }

    restartPages()
  }, [filters, sort, viewMode])

  const pageSize = useMemo(() => {
    switch (viewMode) {
      case 'table':
        return TABLE_PAGE_SIZE
      case 'grid':
      default:
        return GRID_PAGE_SIZE
    }
  }, [viewMode])

  const totalPages = Math.ceil(pokemon.length / pageSize)
  const paginated = pokemon.slice(page * pageSize, (page + 1) * pageSize)

  const handleCatch = (p: Pokemon) => {
    pokedex.catch({ id: p.id, name: p.name })
  }

  const renderList = () => {
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

    return (
      <PokemonList
        pokemon={paginated}
        caught={pokedex.caught}
        viewMode={viewMode}
        sort={sort}
        onSortChange={setSort}
        onCatch={handleCatch}
        onRelease={pokedex.release}
      />
    )
  }

  const content = (
    <>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <ViewToggle
          value={viewMode}
          onChange={setViewMode}
          options={VIEW_OPTIONS}
        />

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>
            Available:{' '}
            <strong className="text-gray-900">{pokemon.length}</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            Caught:{' '}
            <strong className="text-red-600">{pokedex.caughtCount}</strong>
          </span>
        </div>
      </div>

      {renderList()}
    </>
  )

  return (
    <HomeLayout
      topBar={<TopBar />}
      sidebar={
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />
      }
      content={content}
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
