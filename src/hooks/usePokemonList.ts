import { useEffect, useState } from 'react'
import type { Pokemon } from '../types/pokemon'
import { fetchPokemon } from '../apis/pokemonAPI'

const TOTAL = 151

interface UsePokemonListReturn {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
  count: number
}

export function usePokemonList(
  offset: number,
  limit: number,
): UsePokemonListReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const end = Math.min(offset + limit, TOTAL)
        const ids = Array.from(
          { length: end - offset },
          (_, i) => offset + i + 1,
        )

        const results = await Promise.all(ids.map((id) => fetchPokemon(id)))
        if (!cancelled) setPokemon(results)
      } catch {
        if (!cancelled) setError('Failed to load Pokémon. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [offset, limit])

  return { pokemon, loading, error, count: TOTAL }
}
