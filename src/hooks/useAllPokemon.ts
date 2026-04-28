import { useEffect, useState } from 'react'
import { fetchGen1, GEN1_COUNT } from '../apis/pokemonAPI'
import {
  cacheAllPokemon,
  getAllCachedPokemon,
  isCachePopulated,
} from '../repositories/pokemon.repository'
import type { Pokemon } from '../types/pokemon'

export function useAllPokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fetches all Pokémon data, either from cache or by making API requests.
     */
    const fetchAllPokemon = async () => {
      if (await isCachePopulated(GEN1_COUNT)) {
        setPokemon(await getAllCachedPokemon())
        return
      }

      const all = await fetchGen1()
      await cacheAllPokemon(all)
      setPokemon(all)
    }

    async function load() {
      try {
        await fetchAllPokemon()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load Pokémon')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { pokemon, loading, error }
}
