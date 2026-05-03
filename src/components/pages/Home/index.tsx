import { useState, useEffect, useMemo } from 'react'
import FilterPanel, { type Filters } from '../../organisms/FilterPanel'
import PokemonList from '../../organisms/PokemonList'
import Pagination from '../../molecules/Pagination'
import HomeLayout from '../../templates/HomeLayout'
import { useAllPokemon } from '../../../hooks/useAllPokemon'
import { useDebounce } from '../../../hooks/useDebounce'
import { usePokedex } from '../../../hooks/usePokedex'
import { useBulkSelect } from '../../../hooks/useBulkSelect'
import type { Sort } from '../../../types/filters'
import type { Pokemon } from '../../../types/pokemon'
import TopBar from '../../molecules/TopBar'
import PokedexToggle from '../../atoms/PokedexToggle'
import Sidebar from '../../organisms/Sidebar'
import HomeToolbar, { type ViewMode } from './HomeToolbar'

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

export default function Home() {
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pokedex = usePokedex()
  const bulk = useBulkSelect({ releaseMany: pokedex.releaseMany })
  const debouncedFilters = useDebounce(filters)
  const { pokemon, totalPokemon, loading, error } = useAllPokemon(
    debouncedFilters,
    sort,
    pokedex.caught,
  )

  useEffect(() => {
    const resetView = () => {
      setPage(0)
    }

    resetView()
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
        selectedIds={bulk.selectedIds}
        onToggleSelect={bulk.bulkSelectMode ? bulk.toggleSelect : undefined}
      />
    )
  }

  const togglePokedexView = () => {
    setFilters((prev) => {
      if (prev.caughtOnly) bulk.exitBulkMode()
      return { ...prev, caughtOnly: !prev.caughtOnly }
    })
  }

  const content = (
    <>
      <HomeToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalPokemon={totalPokemon}
        caughtCount={pokedex.caughtCount}
        caughtOnly={filters.caughtOnly}
        bulkSelectMode={bulk.bulkSelectMode}
        selectedCount={bulk.selectedIds.size}
        onOpenFilters={() => setSidebarOpen(true)}
        onClearFilters={() => setFilters(DEFAULT_FILTERS)}
        onToggleBulkMode={bulk.toggleBulkMode}
        onBulkRelease={bulk.bulkRelease}
      />

      {renderList()}
    </>
  )

  return (
    <>
      <HomeLayout
        topBar={
          <TopBar
            onExport={pokedex.exportPokedex}
            onImport={pokedex.importPokedex}
          />
        }
        sidebar={
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
            />
          </Sidebar>
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

      <PokedexToggle active={filters.caughtOnly} onClick={togglePokedexView} />
    </>
  )
}
