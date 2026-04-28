import type { CaughtPokemon } from '../types/pokemon'
import { getIndexedDB, tx, wrap, CAUGHT_STORE } from '../apis/indexedDB'

export async function catchPokemon(
  pokemon: Omit<CaughtPokemon, 'caughtAt' | 'note'>,
): Promise<void> {
  const db = await getIndexedDB()
  const entry: CaughtPokemon = {
    ...pokemon,
    caughtAt: new Date().toISOString(),
    note: '',
  }
  await wrap(tx(db, CAUGHT_STORE, 'readwrite').put(entry))
}

export async function releasePokemon(id: number): Promise<void> {
  const db = await getIndexedDB()
  await wrap(tx(db, CAUGHT_STORE, 'readwrite').delete(id))
}

export async function releaseMany(ids: number[]): Promise<void> {
  const db = await getIndexedDB()
  const store = tx(db, CAUGHT_STORE, 'readwrite')
  await Promise.all(ids.map((id) => wrap(store.delete(id))))
}

export async function updateNote(id: number, note: string): Promise<void> {
  const db = await getIndexedDB()
  const store = tx(db, CAUGHT_STORE, 'readwrite')
  const existing = await wrap<CaughtPokemon>(store.get(id))
  if (existing) {
    await wrap(store.put({ ...existing, note }))
  }
}

export async function getAllCaught(): Promise<CaughtPokemon[]> {
  const db = await getIndexedDB()
  return wrap<CaughtPokemon[]>(tx(db, CAUGHT_STORE, 'readonly').getAll())
}

export async function getCaughtPokemon(
  id: number,
): Promise<CaughtPokemon | undefined> {
  const db = await getIndexedDB()
  return wrap<CaughtPokemon | undefined>(
    tx(db, CAUGHT_STORE, 'readonly').get(id),
  )
}

export async function getCaughtCount(): Promise<number> {
  const db = await getIndexedDB()
  return wrap<number>(tx(db, CAUGHT_STORE, 'readonly').count())
}
