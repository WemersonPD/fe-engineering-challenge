import { useCallback, useEffect, useState } from 'react'
import type { CaughtPokemon } from '../types/pokemon'
import {
  catchPokemon as dbCatch,
  releasePokemon as dbRelease,
  releaseMany as dbReleaseMany,
  updateNote as dbUpdateNote,
  getAllCaught,
} from '../repositories/pokemon.repository'

interface UsePokedexReturn {
  caught: Map<number, CaughtPokemon>
  caughtCount: number
  isCaught: (id: number) => boolean
  catch: (pokemon: Pick<CaughtPokemon, 'id' | 'name'>) => Promise<void>
  release: (id: number) => Promise<void>
  releaseMany: (ids: number[]) => Promise<void>
  updateNote: (id: number, note: string) => Promise<void>
}

export function usePokedex(): UsePokedexReturn {
  const [caught, setCaught] = useState<Map<number, CaughtPokemon>>(new Map())

  useEffect(() => {
    getAllCaught().then((all) => {
      setCaught(new Map(all.map((p) => [p.id, p])))
    })
  }, [])

  const catchPokemon = useCallback(
    async (pokemon: Pick<CaughtPokemon, 'id' | 'name'>) => {
      await dbCatch(pokemon)
      const entry: CaughtPokemon = {
        ...pokemon,
        caughtAt: new Date().toISOString(),
        note: '',
      }
      setCaught((prev) => new Map(prev).set(pokemon.id, entry))
    },
    [],
  )

  const release = useCallback(async (id: number) => {
    await dbRelease(id)
    setCaught((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const releaseMany = useCallback(async (ids: number[]) => {
    await dbReleaseMany(ids)
    setCaught((prev) => {
      const next = new Map(prev)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }, [])

  const updateNote = useCallback(async (id: number, note: string) => {
    await dbUpdateNote(id, note)
    setCaught((prev) => {
      const existing = prev.get(id)
      if (!existing) return prev
      return new Map(prev).set(id, { ...existing, note })
    })
  }, [])

  const isCaught = useCallback((id: number) => caught.has(id), [caught])

  return {
    caught,
    caughtCount: caught.size,
    isCaught,
    catch: catchPokemon,
    release,
    releaseMany,
    updateNote,
  }
}
