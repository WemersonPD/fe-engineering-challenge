import { useState, useEffect, useMemo } from 'react'
import FilterPanel, { type Filters } from './components/organisms/FilterPanel'
import PokemonList from './components/organisms/PokemonList'
import Pagination from './components/molecules/Pagination'
import TopBar, { type ViewMode } from './components/molecules/TopBar'
import DefaultLayout from './components/templates/DefaultLayout'
import { useAllPokemon } from './hooks/useAllPokemon'
import { useDebounce } from './hooks/useDebounce'
import { usePokedex } from './hooks/usePokedex'
import type { Sort } from './types/filters'
import type { Pokemon } from './types/pokemon'

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
