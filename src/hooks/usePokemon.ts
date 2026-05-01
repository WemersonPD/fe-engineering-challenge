import { useState, useEffect } from 'react'
import { fetchPokemon } from '../apis/pokemonAPI'
import type { Pokemon } from '../types/pokemon'

export function usePokemon(id: string | undefined) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchPokemon(id!)
        setPokemon(data)
      } catch {
        setError('Failed to load Pokémon.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  return { pokemon, loading, error }
}
