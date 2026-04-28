import { useEffect, useState } from 'react'
import type { Pokemon } from '../types/pokemon'
import { fetchPokemon } from '../apis/pokemonAPI'

interface UsePokemonListReturn {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
}

export function usePokemonList(ids: number[]): UsePokemonListReturn {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
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
  }, [ids.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return { pokemon, loading, error }
}
