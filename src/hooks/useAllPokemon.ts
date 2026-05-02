import { useEffect, useMemo, useState } from 'react'
import { fetchGen1, GEN1_COUNT } from '../apis/pokemonAPI'
import {
  cacheAllPokemon,
  getAllCachedPokemon,
  isCachePopulated,
} from '../repositories/pokemon.repository'
import type { Filters, Sort } from '../types/filters'
import type { CaughtPokemon, Pokemon } from '../types/pokemon'

function matchesName(p: Pokemon, name: string): boolean {
  if (!name) return true

  return p.name.toLowerCase().includes(name.toLowerCase())
}

function matchesTypes(p: Pokemon, types: string[]): boolean {
  if (types.length === 0) return true

  return types
    .map((t) => t.toLowerCase())
    .some((t) => p.types.includes(t.toLowerCase()))
}

function matchesHeight(p: Pokemon, min: number, max: number): boolean {
  if (p.height < min) return false
  if (p.height > max) return false

  return true
}

function matchesCaught(
  p: Pokemon,
  caught: Map<number, CaughtPokemon>,
  filters: Filters,
): boolean {
  if (!filters.caughtOnly) return true

  const c = caught.get(p.id)
  if (!c) return false

  if (filters.caughtAfter && c.caughtAt < filters.caughtAfter) return false
  if (filters.caughtBefore && c.caughtAt > filters.caughtBefore) return false

  return true
}

function sortPokemon(
  list: Pokemon[],
  caught: Map<number, CaughtPokemon>,
  sort: Sort,
): Pokemon[] {
  const sorted = [...list].sort((a, b) => {
    switch (sort.field) {
      case 'id':
        return a.id - b.id
      case 'name':
        return a.name.localeCompare(b.name)
      case 'height':
        return a.height - b.height
      case 'types':
        return (a.types[0] ?? '').localeCompare(b.types[0] ?? '')
      case 'timestamp': {
        const ta = caught.get(a.id)?.caughtAt ?? ''
        const tb = caught.get(b.id)?.caughtAt ?? ''

        return ta.localeCompare(tb)
      }
    }
  })

  return sort.order === 'desc' ? sorted.reverse() : sorted
}

export function useAllPokemon(
  filters: Filters,
  sort: Sort,
  caught: Map<number, CaughtPokemon>,
) {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllPokemon = async () => {
      if (await isCachePopulated(GEN1_COUNT)) {
        setAllPokemon(await getAllCachedPokemon())
        return
      }

      const all = await fetchGen1()
      await cacheAllPokemon(all)
      setAllPokemon(all)
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

  const pokemon = useMemo(() => {
    const filtered = allPokemon.filter(
      (p) =>
        matchesName(p, filters.name) &&
        matchesTypes(p, filters.types) &&
        matchesHeight(p, filters.minHeight, filters.maxHeight) &&
        matchesCaught(p, caught, filters),
    )
    return sortPokemon(filtered, caught, sort)
  }, [allPokemon, filters, sort, caught])

  return { pokemon, totalPokemon: allPokemon.length, loading, error }
}
