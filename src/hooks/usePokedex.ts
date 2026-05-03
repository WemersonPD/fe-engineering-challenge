import { useCallback, useEffect, useState } from 'react'
import type { CaughtPokemon } from '../types/pokemon'
import {
  catchPokemon as dbCatch,
  catchManyPokemon as dbCatchMany,
  releasePokemon as dbRelease,
  releaseMany as dbReleaseMany,
  updateNote as dbUpdateNote,
  getAllCaught,
} from '../repositories/pokemon.repository'
import { exportCSV, importCSV } from '../utils/file'

const POKEDEX_CSV_HEADERS = {
  ID: 'ID',
  NAME: 'Name',
  CAUGHT_AT: 'CaughtAt',
  NOTES: 'Notes',
} as const

function mapCaughtPokemon(rows: Record<string, string>[]): CaughtPokemon[] {
  const entries: CaughtPokemon[] = []

  for (const row of rows) {
    const id = Number(row[POKEDEX_CSV_HEADERS.ID])
    const name = row[POKEDEX_CSV_HEADERS.NAME]
    const caughtAt = row[POKEDEX_CSV_HEADERS.CAUGHT_AT]
    const note = row[POKEDEX_CSV_HEADERS.NOTES] ?? ''

    if (!id || !name || !caughtAt) continue

    entries.push({ id, name, caughtAt, note })
  }

  return entries
}

interface UsePokedexReturn {
  caught: Map<number, CaughtPokemon>
  caughtCount: number
  isCaught: (id: number) => boolean
  catch: (pokemon: Pick<CaughtPokemon, 'id' | 'name'>) => Promise<void>
  release: (id: number) => Promise<void>
  releaseMany: (ids: number[]) => Promise<void>
  updateNote: (id: number, note: string) => Promise<void>
  exportPokedex: () => void
  importPokedex: (file: File) => Promise<{ success: boolean; error?: string }>
}

export function usePokedex(): UsePokedexReturn {
  const [caught, setCaught] = useState<Map<number, CaughtPokemon>>(new Map())

  useEffect(() => {
    const populateAllCaught = async () => {
      try {
        const all = await getAllCaught()

        setCaught(new Map(all.map((p) => [p.id, p])))
      } catch (error) {
        console.error('Failed to fetch caught Pokémon:', error)
      }
    }

    populateAllCaught()
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

  const catchManyIfNew = useCallback(
    async (entries: CaughtPokemon[]) => {
      const newEntries = entries.filter((entry) => !caught.has(entry.id))

      if (newEntries.length === 0) return

      await dbCatchMany(newEntries)

      setCaught((prev) => {
        const next = new Map(prev)

        newEntries.forEach((entry) => next.set(entry.id, entry))

        return next
      })
    },
    [caught],
  )

  const importPokedex = useCallback(
    async (file: File) => {
      const result = await importCSV(file)

      if (!result.success || !result.data) {
        return { success: false, error: result.error }
      }

      const entries = mapCaughtPokemon(result.data)

      if (entries.length === 0) {
        return { success: false, error: 'No valid entries found' }
      }

      await catchManyIfNew(entries)

      return { success: true }
    },
    [catchManyIfNew],
  )

  const exportPokedex = useCallback(() => {
    const data = Array.from(caught.values()).map(
      ({ id, name, caughtAt, note }) => ({
        [POKEDEX_CSV_HEADERS.ID]: id,
        [POKEDEX_CSV_HEADERS.NAME]: name,
        [POKEDEX_CSV_HEADERS.CAUGHT_AT]: caughtAt,
        [POKEDEX_CSV_HEADERS.NOTES]: note,
      }),
    )

    return exportCSV(data, 'pokedex')
  }, [caught])

  return {
    caught,
    caughtCount: caught.size,
    isCaught,
    catch: catchPokemon,
    release,
    releaseMany,
    updateNote,
    exportPokedex,
    importPokedex,
  }
}
