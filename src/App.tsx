import Card from './components/molecules/Card'
import DefaultLayout from './components/templates/DefaultLayout'
import { usePokemonList } from './hooks/usePokemonList'
import { usePokedex } from './hooks/usePokedex'
import type { Pokemon } from './types/pokemon'

const FIRST_TEN = Array.from({ length: 10 }, (_, i) => i + 1)

function App() {
  const { pokemon, loading, error } = usePokemonList(FIRST_TEN)
  const pokedex = usePokedex()

  function handleCatch(p: Pokemon) {
    pokedex.catch({ id: p.id, name: p.name })
  }

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
    />
  )
}

export default App
