import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tx, wrap } from '../apis/indexedDB'
import type { CaughtPokemon, Pokemon } from '../types/pokemon'
import {
  isCachePopulated,
  cacheAllPokemon,
  getAllCachedPokemon,
  catchPokemon,
  releasePokemon,
  releaseMany,
  updateNote,
  catchManyPokemon,
  getAllCaught,
  getCaughtPokemon,
} from './pokemon.repository'

vi.mock('../apis/indexedDB', () => ({
  getIndexedDB: vi.fn().mockResolvedValue({}),
  tx: vi.fn(),
  wrap: vi.fn(),
  CAUGHT_STORE: 'caught',
  POKEMON_STORE: 'pokemon',
}))

const mockStore = {
  count: vi.fn(),
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
}

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  color: 'green',
  image: 'bulbasaur.png',
  height: 7,
  weight: 69,
  hp: 45,
  speed: 45,
  attack: 49,
  defense: 49,
  specialAttack: 65,
  specialDefense: 65,
  types: ['grass', 'poison'],
}

const mockCaughtPokemon: CaughtPokemon = {
  id: 1,
  name: 'Bulbasaur',
  caughtAt: '2026-05-03T00:00:00.000Z',
  note: 'My first catch',
}

describe('Pokemon Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(tx).mockReturnValue(mockStore as unknown as IDBObjectStore)
    vi.mocked(wrap).mockResolvedValue(undefined as unknown as Promise<unknown>)
  })

  describe('isCachePopulated', () => {
    test.each([
      { expectedCount: 5, count: 5, expected: true },
      { expectedCount: 5, count: 10, expected: true },
      { expectedCount: 5, count: 3, expected: false },
    ])(
      'returns $expected when count is $count and expectedCount is $expectedCount',
      async ({ expectedCount, count, expected }) => {
        vi.mocked(wrap).mockResolvedValueOnce(count)

        const result = await isCachePopulated(expectedCount)
        expect(result).toBe(expected)

        expect(mockStore.count).toHaveBeenCalledOnce()
        expect(tx).toHaveBeenCalledOnce()
      },
    )
  })

  describe('cacheAllPokemon', () => {
    it('puts each pokemon into the pokemon store', async () => {
      const pokemonList = [
        mockPokemon,
        { ...mockPokemon, id: 2, name: 'Ivysaur' },
      ]

      await cacheAllPokemon(pokemonList)

      expect(mockStore.put).toHaveBeenCalledTimes(2)
      expect(mockStore.put).toHaveBeenCalledWith(pokemonList[0])
      expect(mockStore.put).toHaveBeenCalledWith(pokemonList[1])

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'pokemon', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('getAllCachedPokemon', () => {
    it('returns all pokemon from the pokemon store', async () => {
      const pokemonList = [mockPokemon]
      vi.mocked(wrap).mockResolvedValueOnce(pokemonList)

      const result = await getAllCachedPokemon()

      expect(result).toEqual(pokemonList)
      expect(mockStore.getAll).toHaveBeenCalled()

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'pokemon', 'readonly')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('catchPokemon', () => {
    it('stores a pokemon with caughtAt timestamp and empty note', async () => {
      await catchPokemon({ id: 1, name: 'Bulbasaur' })

      expect(mockStore.put).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Bulbasaur',
          note: '',
          caughtAt: expect.any(String),
        }),
      )

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('releasePokemon', () => {
    it('deletes a pokemon by id from the caught store', async () => {
      await releasePokemon(1)

      expect(mockStore.delete).toHaveBeenCalledWith(1)
    })

    it('opens the caught store in readwrite mode', async () => {
      await releasePokemon(1)

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('releaseMany', () => {
    it('deletes each id from the caught store', async () => {
      await releaseMany([1, 2, 3])

      expect(mockStore.delete).toHaveBeenCalledTimes(3)
      expect(mockStore.delete).toHaveBeenCalledWith(1)
      expect(mockStore.delete).toHaveBeenCalledWith(2)
      expect(mockStore.delete).toHaveBeenCalledWith(3)

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('updateNote', () => {
    it('updates the note on an existing caught pokemon', async () => {
      vi.mocked(wrap)
        .mockResolvedValueOnce(mockCaughtPokemon)
        .mockResolvedValueOnce(undefined)

      await updateNote(1, 'Updated note')

      expect(mockStore.get).toHaveBeenCalledWith(1)
      expect(mockStore.put).toHaveBeenCalledWith({
        ...mockCaughtPokemon,
        note: 'Updated note',
      })

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })

    it('does not put anything when the pokemon does not exist', async () => {
      vi.mocked(wrap).mockResolvedValueOnce(undefined)

      await updateNote(999, 'Some note')

      expect(mockStore.put).not.toHaveBeenCalled()
    })
  })

  describe('catchManyPokemon', () => {
    it('stores each entry in the caught store', async () => {
      const entries = [
        mockCaughtPokemon,
        { ...mockCaughtPokemon, id: 2, name: 'Ivysaur' },
      ]

      await catchManyPokemon(entries)

      expect(mockStore.put).toHaveBeenCalledTimes(2)
      expect(mockStore.put).toHaveBeenCalledWith(entries[0])
      expect(mockStore.put).toHaveBeenCalledWith(entries[1])

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readwrite')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('getAllCaught', () => {
    it('returns all caught pokemon', async () => {
      const caughtList = [mockCaughtPokemon]
      vi.mocked(wrap).mockResolvedValueOnce(caughtList)

      const result = await getAllCaught()

      expect(result).toEqual(caughtList)
      expect(mockStore.getAll).toHaveBeenCalled()

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readonly')
      expect(tx).toHaveBeenCalledOnce()
    })
  })

  describe('getCaughtPokemon', () => {
    it('returns a caught pokemon by id', async () => {
      vi.mocked(wrap).mockResolvedValueOnce(mockCaughtPokemon)

      const result = await getCaughtPokemon(1)

      expect(result).toEqual(mockCaughtPokemon)
      expect(mockStore.get).toHaveBeenCalledWith(1)

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readonly')
      expect(tx).toHaveBeenCalledOnce()
    })

    it('returns undefined when the pokemon is not caught', async () => {
      vi.mocked(wrap).mockResolvedValueOnce(undefined)

      const result = await getCaughtPokemon(999)

      expect(result).toBeUndefined()

      expect(mockStore.get).toHaveBeenCalledWith(999)

      expect(tx).toHaveBeenCalledWith(expect.anything(), 'caught', 'readonly')
      expect(tx).toHaveBeenCalledOnce()
    })
  })
})
