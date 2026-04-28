import { useState } from 'react'
import Button from './components/atoms/Button'
import Card from './components/molecules/Card'
import DefaultLayout from './components/templates/DefaultLayout'
import { usePokemonList } from './hooks/usePokemonList'
import { usePokedex } from './hooks/usePokedex'
import type { Pokemon } from './types/pokemon'

const PAGE_SIZE = 10

function App() {
  const [page, setPage] = useState(0)
  const offset = page * PAGE_SIZE
  const { pokemon, loading, error, count } = usePokemonList(offset, PAGE_SIZE)
  const pokedex = usePokedex()
  const totalPages = Math.ceil(count / PAGE_SIZE)

  function handleCatch(p: Pokemon) {
    pokedex.catch({ id: p.id, name: p.name })
  }

  const pagination = (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="gray"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 0}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="gray"
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </Button>
    </div>
  )

  if (loading) {
    return (
      <DefaultLayout
        search={<input type="text" placeholder="Search..." />}
        sidebar={<nav aria-label="Product filters">Sidebar content</nav>}
        content={
          <p role="status" className="text-gray-500 text-sm">
            Loading Pokémon...
          </p>
        }
        pagination={pagination}
      />
    )
  }

  if (error) {
    return (
      <DefaultLayout
        search={<input type="text" placeholder="Search..." />}
        sidebar={<nav aria-label="Product filters">Sidebar content</nav>}
        content={
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        }
        pagination={pagination}
      />
    )
  }

  return (
    <DefaultLayout
      search={<input type="text" placeholder="Search..." />}
      sidebar={<nav aria-label="Product filters">Sidebar content</nav>}
      content={
        <ul className="flex flex-wrap gap-4" aria-label="Pokémon list">
          {pokemon.map((p) => (
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
      }
      pagination={pagination}
    />
  )
}

export default App
