import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokedex } from './usePokedex'
import * as repository from '../repositories/pokemon.repository'
import * as fileUtils from '../utils/file'
import type { CaughtPokemon } from '../types/pokemon'

vi.mock('../repositories/pokemon.repository')
vi.mock('../utils/file')

const mockCaughtPokemon: CaughtPokemon = {
  id: 1,
  name: 'Bulbasaur',
  caughtAt: '2026-05-03T00:00:00.000Z',
  note: '',
}

const setupCaught = (entries: CaughtPokemon[] = []) =>
  vi.mocked(repository.getAllCaught).mockResolvedValueOnce(entries)

describe('usePokedex', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with an empty caught map', async () => {
      setupCaught()
      const { result } = renderHook(() => usePokedex())

      await waitFor(() => {
        expect(result.current.caught.size).toBe(0)
        expect(result.current.caughtCount).toBe(0)
      })
    })

    it('loads all caught pokemon on mount', async () => {
      setupCaught([mockCaughtPokemon])
      const { result } = renderHook(() => usePokedex())

      await waitFor(() => expect(result.current.caught.size).toBe(1))
      expect(result.current.caught.get(1)).toEqual(mockCaughtPokemon)
    })
  })

  describe('isCaught', () => {
    it('returns true when pokemon is in the caught map', async () => {
      setupCaught([mockCaughtPokemon])
      const { result } = renderHook(() => usePokedex())

      await waitFor(() => expect(result.current.isCaught(1)).toBe(true))
    })

    it('returns false when pokemon is not in the caught map', async () => {
      setupCaught()
      const { result } = renderHook(() => usePokedex())

      await waitFor(() => expect(result.current.isCaught(999)).toBe(false))
    })
  })

  describe('catch', () => {
    it('calls catchPokemon and adds the entry to the caught map', async () => {
      setupCaught()
      vi.mocked(repository.catchPokemon).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      await act(() => result.current.catch({ id: 1, name: 'Bulbasaur' }))

      expect(repository.catchPokemon).toHaveBeenCalledWith({
        id: 1,
        name: 'Bulbasaur',
      })
      expect(result.current.caught.get(1)).toMatchObject({
        id: 1,
        name: 'Bulbasaur',
        note: '',
        caughtAt: expect.any(String),
      })
    })

    it('increments caughtCount', async () => {
      setupCaught()
      vi.mocked(repository.catchPokemon).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      await act(() => result.current.catch({ id: 1, name: 'Bulbasaur' }))

      expect(result.current.caughtCount).toBe(1)
    })
  })

  describe('release', () => {
    it('calls releasePokemon and removes the pokemon from the caught map', async () => {
      setupCaught([mockCaughtPokemon])
      vi.mocked(repository.releasePokemon).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caught.has(1)).toBe(true))

      await act(() => result.current.release(1))

      expect(repository.releasePokemon).toHaveBeenCalledWith(1)
      expect(result.current.caught.has(1)).toBe(false)
    })
  })

  describe('releaseMany', () => {
    it('calls releaseMany and removes all specified pokemon from the caught map', async () => {
      const second: CaughtPokemon = {
        ...mockCaughtPokemon,
        id: 2,
        name: 'Ivysaur',
      }
      setupCaught([mockCaughtPokemon, second])
      vi.mocked(repository.releaseMany).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caught.size).toBe(2))

      await act(() => result.current.releaseMany([1, 2]))

      expect(repository.releaseMany).toHaveBeenCalledWith([1, 2])
      expect(result.current.caught.size).toBe(0)
    })
  })

  describe('updateNote', () => {
    it('calls updateNote and updates the note in the caught map', async () => {
      setupCaught([mockCaughtPokemon])
      vi.mocked(repository.updateNote).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caught.has(1)).toBe(true))

      await act(() => result.current.updateNote(1, 'New note'))

      expect(repository.updateNote).toHaveBeenCalledWith(1, 'New note')
      expect(result.current.caught.get(1)?.note).toBe('New note')
    })

    it('does not modify the caught map when the pokemon is not caught', async () => {
      setupCaught()
      vi.mocked(repository.updateNote).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      const before = result.current.caught

      await act(() => result.current.updateNote(999, 'New note'))

      expect(result.current.caught).toStrictEqual(before)
    })
  })

  describe('exportPokedex', () => {
    it('calls exportCSV with the correct headers and data', async () => {
      setupCaught([mockCaughtPokemon])
      vi.mocked(fileUtils.exportCSV).mockReturnValueOnce({ success: true })

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caught.size).toBe(1))

      act(() => result.current.exportPokedex())

      expect(fileUtils.exportCSV).toHaveBeenCalledWith(
        [
          {
            ID: 1,
            Name: 'Bulbasaur',
            CaughtAt: '2026-05-03T00:00:00.000Z',
            Notes: '',
          },
        ],
        'pokedex',
      )
    })
  })

  describe('importPokedex', () => {
    const makeFile = (content: string) =>
      new File([content], 'pokedex.csv', { type: 'text/csv' })

    it('returns failure when importCSV fails', async () => {
      setupCaught()
      vi.mocked(fileUtils.importCSV).mockResolvedValueOnce({
        success: false,
        error: 'Parse error',
      })

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      const outcome = await act(() =>
        result.current.importPokedex(makeFile('')),
      )

      expect(outcome).toEqual({ success: false, error: 'Parse error' })
    })

    it('returns failure when no valid entries are found in CSV data', async () => {
      setupCaught()
      vi.mocked(fileUtils.importCSV).mockResolvedValueOnce({
        success: true,
        data: [{ bad: 'row' }],
      })

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      const outcome = await act(() =>
        result.current.importPokedex(makeFile('')),
      )

      expect(outcome).toEqual({
        success: false,
        error: 'No valid entries found',
      })
    })

    it('imports new entries, adds them to caught state and returns success', async () => {
      setupCaught()
      vi.mocked(fileUtils.importCSV).mockResolvedValueOnce({
        success: true,
        data: [
          {
            ID: '2',
            Name: 'Ivysaur',
            CaughtAt: '2026-05-04T00:00:00.000Z',
            Notes: 'imported',
          },
        ],
      })
      vi.mocked(repository.catchManyPokemon).mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caughtCount).toBe(0))

      const outcome = await act(() =>
        result.current.importPokedex(makeFile('')),
      )

      expect(outcome).toEqual({ success: true })
      expect(repository.catchManyPokemon).toHaveBeenCalledWith([
        {
          id: 2,
          name: 'Ivysaur',
          caughtAt: '2026-05-04T00:00:00.000Z',
          note: 'imported',
        },
      ])
      expect(result.current.caught.has(2)).toBe(true)
    })

    it('skips already-caught pokemon and does not call catchManyPokemon', async () => {
      setupCaught([mockCaughtPokemon])
      vi.mocked(fileUtils.importCSV).mockResolvedValueOnce({
        success: true,
        data: [
          {
            ID: '1',
            Name: 'Bulbasaur',
            CaughtAt: '2026-05-03T00:00:00.000Z',
            Notes: '',
          },
        ],
      })

      const { result } = renderHook(() => usePokedex())
      await waitFor(() => expect(result.current.caught.has(1)).toBe(true))

      await act(() => result.current.importPokedex(makeFile('')))

      expect(repository.catchManyPokemon).not.toHaveBeenCalled()
    })
  })
})
