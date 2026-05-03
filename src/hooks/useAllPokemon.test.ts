import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAllPokemon } from './useAllPokemon'
import * as pokemonAPI from '../apis/pokemonAPI'
import * as pokemonRepository from '../repositories/pokemon.repository'
import type { Filters, Sort } from '../types/filters'
import type { CaughtPokemon, Pokemon } from '../types/pokemon'

vi.mock('../apis/pokemonAPI')
vi.mock('../repositories/pokemon.repository')

const makePokemon = (overrides: Partial<Pokemon> = {}): Pokemon => ({
  id: 1,
  name: 'bulbasaur',
  color: 'green',
  image: 'https://example.com/bulbasaur.png',
  height: 7,
  weight: 69,
  hp: 45,
  speed: 45,
  attack: 49,
  defense: 49,
  specialAttack: 65,
  specialDefense: 65,
  types: ['grass', 'poison'],
  ...overrides,
})

const defaultFilters: Filters = {
  name: '',
  types: [],
  minHeight: 0,
  maxHeight: Infinity,
  caughtOnly: false,
  caughtAfter: '',
  caughtBefore: '',
}

const defaultSort: Sort = { field: 'id', order: 'asc' }
const emptyCaught: Map<number, CaughtPokemon> = new Map()

describe('useAllPokemon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('data loading', () => {
    it('returns loading true initially', () => {
      vi.mocked(pokemonRepository.isCachePopulated).mockReturnValueOnce(
        new Promise(() => {}),
      )

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      expect(result.current.loading).toBe(true)
      expect(result.current.pokemon).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('loads pokemon from cache when cache is populated', async () => {
      const cached = [makePokemon({ id: 1 }), makePokemon({ id: 2, name: 'ivysaur' })]
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(true)
      vi.mocked(pokemonRepository.getAllCachedPokemon).mockResolvedValueOnce(cached)

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual(cached)
      expect(result.current.totalPokemon).toBe(2)
      expect(pokemonAPI.fetchGen1).not.toHaveBeenCalled()
    })

    it('fetches and caches pokemon when cache is empty', async () => {
      const fetched = [makePokemon({ id: 1 }), makePokemon({ id: 2, name: 'ivysaur' })]
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(false)
      vi.mocked(pokemonAPI.fetchGen1).mockResolvedValueOnce(fetched)
      vi.mocked(pokemonRepository.cacheAllPokemon).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(pokemonAPI.fetchGen1).toHaveBeenCalledTimes(1)
      expect(pokemonRepository.cacheAllPokemon).toHaveBeenCalledWith(fetched)
      expect(result.current.pokemon).toEqual(fetched)
    })

    it('sets error when fetch fails', async () => {
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(false)
      vi.mocked(pokemonAPI.fetchGen1).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBe('Network error')
      expect(result.current.pokemon).toEqual([])
    })

    it('sets generic error message when thrown value is not an Error', async () => {
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(false)
      vi.mocked(pokemonAPI.fetchGen1).mockRejectedValueOnce('something went wrong')

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.error).toBe('Failed to load Pokémon')
    })
  })

  describe('filtering', () => {
    const bulbasaur = makePokemon({ id: 1, name: 'bulbasaur', types: ['grass', 'poison'], height: 7 })
    const charmander = makePokemon({ id: 4, name: 'charmander', types: ['fire'], height: 6 })
    const squirtle = makePokemon({ id: 7, name: 'squirtle', types: ['water'], height: 5 })

    beforeEach(() => {
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(true)
      vi.mocked(pokemonRepository.getAllCachedPokemon).mockResolvedValueOnce([
        bulbasaur,
        charmander,
        squirtle,
      ])
    })

    it('filters by name (case-insensitive)', async () => {
      const filters = { ...defaultFilters, name: 'CHAR' }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([charmander])
    })

    it('filters by type', async () => {
      const filters = { ...defaultFilters, types: ['water'] }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([squirtle])
    })

    it('matches pokemon with at least one of the selected types', async () => {
      const filters = { ...defaultFilters, types: ['fire', 'water'] }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([charmander, squirtle])
    })

    it('filters by height range', async () => {
      const filters = { ...defaultFilters, minHeight: 6, maxHeight: 6 }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([charmander])
    })

    it('returns all pokemon when filters are empty', async () => {
      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toHaveLength(3)
    })

    it('filters to only caught pokemon when caughtOnly is true', async () => {
      const caught: Map<number, CaughtPokemon> = new Map([
        [1, { id: 1, name: 'bulbasaur', caughtAt: '2024-01-01', note: '' }],
      ])
      const filters = { ...defaultFilters, caughtOnly: true }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, caught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([bulbasaur])
    })

    it('filters caught pokemon by caughtAfter date', async () => {
      const caught: Map<number, CaughtPokemon> = new Map([
        [1, { id: 1, name: 'bulbasaur', caughtAt: '2024-01-01', note: '' }],
        [4, { id: 4, name: 'charmander', caughtAt: '2024-06-01', note: '' }],
      ])
      const filters = { ...defaultFilters, caughtOnly: true, caughtAfter: '2024-03-01' }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, caught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([charmander])
    })

    it('filters caught pokemon by caughtBefore date', async () => {
      const caught: Map<number, CaughtPokemon> = new Map([
        [1, { id: 1, name: 'bulbasaur', caughtAt: '2024-01-01', note: '' }],
        [4, { id: 4, name: 'charmander', caughtAt: '2024-06-01', note: '' }],
      ])
      const filters = { ...defaultFilters, caughtOnly: true, caughtBefore: '2024-03-01' }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, caught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toEqual([bulbasaur])
    })
  })

  describe('sorting', () => {
    const bulbasaur = makePokemon({ id: 1, name: 'bulbasaur', types: ['grass'], height: 7 })
    const charmander = makePokemon({ id: 4, name: 'charmander', types: ['fire'], height: 6 })
    const squirtle = makePokemon({ id: 7, name: 'squirtle', types: ['water'], height: 5 })

    beforeEach(() => {
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(true)
      vi.mocked(pokemonRepository.getAllCachedPokemon).mockResolvedValueOnce([
        squirtle,
        charmander,
        bulbasaur,
      ])
    })

    it('sorts by id ascending', async () => {
      const sort: Sort = { field: 'id', order: 'asc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.id)).toEqual([1, 4, 7])
    })

    it('sorts by id descending', async () => {
      const sort: Sort = { field: 'id', order: 'desc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.id)).toEqual([7, 4, 1])
    })

    it('sorts by name ascending', async () => {
      const sort: Sort = { field: 'name', order: 'asc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.name)).toEqual([
        'bulbasaur',
        'charmander',
        'squirtle',
      ])
    })

    it('sorts by height ascending', async () => {
      const sort: Sort = { field: 'height', order: 'asc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.height)).toEqual([5, 6, 7])
    })

    it('sorts by types ascending', async () => {
      const sort: Sort = { field: 'types', order: 'asc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.types[0])).toEqual([
        'fire',
        'grass',
        'water',
      ])
    })

    it('sorts by caught timestamp ascending', async () => {
      const caught: Map<number, CaughtPokemon> = new Map([
        [1, { id: 1, name: 'bulbasaur', caughtAt: '2024-03-01', note: '' }],
        [4, { id: 4, name: 'charmander', caughtAt: '2024-01-01', note: '' }],
        [7, { id: 7, name: 'squirtle', caughtAt: '2024-06-01', note: '' }],
      ])
      const sort: Sort = { field: 'timestamp', order: 'asc' }

      const { result } = renderHook(() =>
        useAllPokemon(defaultFilters, sort, caught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon.map((p) => p.name)).toEqual([
        'charmander',
        'bulbasaur',
        'squirtle',
      ])
    })
  })

  describe('totalPokemon', () => {
    it('reflects the unfiltered count', async () => {
      const all = [makePokemon({ id: 1 }), makePokemon({ id: 2, name: 'ivysaur' })]
      vi.mocked(pokemonRepository.isCachePopulated).mockResolvedValueOnce(true)
      vi.mocked(pokemonRepository.getAllCachedPokemon).mockResolvedValueOnce(all)

      const filters = { ...defaultFilters, name: 'ivysaur' }

      const { result } = renderHook(() =>
        useAllPokemon(filters, defaultSort, emptyCaught),
      )

      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(result.current.pokemon).toHaveLength(1)
      expect(result.current.totalPokemon).toBe(2)
    })
  })
})
