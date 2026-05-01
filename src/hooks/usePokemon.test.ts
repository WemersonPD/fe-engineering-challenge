import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemon } from './usePokemon'
import * as pokemonAPI from '../apis/pokemonAPI'
import type { Pokemon } from '../types/pokemon'

vi.mock('../apis/pokemonAPI')

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  color: 'green',
  image: 'https://example.com/bulbasaur.png',
  height: 0.7,
  weight: 6.9,
  hp: 45,
  speed: 45,
  attack: 49,
  defense: 49,
  specialAttack: 65,
  specialDefense: 65,
  types: ['grass', 'poison'],
}

describe('usePokemon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns loading true initially', () => {
    vi.mocked(pokemonAPI.fetchPokemon).mockReturnValueOnce(
      new Promise(() => {}),
    )
    const { result } = renderHook(() => usePokemon('1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.pokemon).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('returns pokemon data on success', async () => {
    vi.mocked(pokemonAPI.fetchPokemon).mockResolvedValueOnce(mockPokemon)
    const { result } = renderHook(() => usePokemon('1'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.pokemon).toEqual(mockPokemon)
    expect(result.current.error).toBeNull()
  })

  it('returns error message on failure', async () => {
    vi.mocked(pokemonAPI.fetchPokemon).mockRejectedValueOnce(
      new Error('Network error'),
    )
    const { result } = renderHook(() => usePokemon('1'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Failed to load Pokémon.')
    expect(result.current.pokemon).toBeNull()
  })

  it('does nothing when id is undefined', () => {
    const { result } = renderHook(() => usePokemon(undefined))

    expect(result.current.loading).toBe(true)
    expect(result.current.pokemon).toBeNull()
    expect(result.current.error).toBeNull()
    expect(pokemonAPI.fetchPokemon).not.toHaveBeenCalled()
  })

  it('refetches when id changes', async () => {
    const secondPokemon: Pokemon = { ...mockPokemon, id: 2, name: 'ivysaur' }
    vi.mocked(pokemonAPI.fetchPokemon)
      .mockResolvedValueOnce(mockPokemon)
      .mockResolvedValueOnce(secondPokemon)

    const { result, rerender } = renderHook(({ id }) => usePokemon(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => expect(result.current.pokemon?.name).toBe('bulbasaur'))

    rerender({ id: '2' })

    await waitFor(() => expect(result.current.pokemon?.name).toBe('ivysaur'))

    expect(pokemonAPI.fetchPokemon).toHaveBeenCalledTimes(2)
    expect(pokemonAPI.fetchPokemon).toHaveBeenNthCalledWith(1, '1')
    expect(pokemonAPI.fetchPokemon).toHaveBeenNthCalledWith(2, '2')
  })
})
