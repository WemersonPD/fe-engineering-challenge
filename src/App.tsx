import { useState, useEffect } from 'react'
import Card from './components/molecules/Card'
import FilterPanel, { type Filters } from './components/organisms/FilterPanel'
import Pagination from './components/molecules/Pagination'
import TopBar, { type ViewMode } from './components/molecules/TopBar'
import DefaultLayout from './components/templates/DefaultLayout'
import { useAllPokemon } from './hooks/useAllPokemon'
import { useDebounce } from './hooks/useDebounce'
import { usePokedex } from './hooks/usePokedex'
import type { Pokemon } from './types/pokemon'

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

export default function App() {
  const [page, setPage] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const pokedex = usePokedex()
  const debouncedFilters = useDebounce(filters)
  const { pokemon, loading, error } = useAllPokemon(
    debouncedFilters,
    pokedex.caught,
  )

  useEffect(() => {
    const setInitialPage = () => {
      setPage(0)
    }

    setInitialPage()
  }, [filters])

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
