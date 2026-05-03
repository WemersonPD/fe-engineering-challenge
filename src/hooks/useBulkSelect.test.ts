import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBulkSelect } from './useBulkSelect'

const makeProps = () => ({ releaseMany: vi.fn().mockResolvedValue(undefined) })

describe('useBulkSelect', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts with bulkSelectMode off and empty selectedIds', () => {
    const { result } = renderHook(() => useBulkSelect(makeProps()))
    expect(result.current.bulkSelectMode).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
  })

  describe('toggleBulkMode', () => {
    it('toggles bulkSelectMode on and off', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleBulkMode())
      expect(result.current.bulkSelectMode).toBe(true)

      act(() => result.current.toggleBulkMode())
      expect(result.current.bulkSelectMode).toBe(false)
    })

    it('clears selectedIds when toggled', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleBulkMode())
      act(() => result.current.toggleSelect(1))
      expect(result.current.selectedIds.has(1)).toBe(true)

      act(() => result.current.toggleBulkMode())
      expect(result.current.selectedIds.size).toBe(0)
    })
  })

  describe('exitBulkMode', () => {
    it('sets bulkSelectMode to false and clears selectedIds', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleBulkMode())
      act(() => result.current.toggleSelect(1))
      act(() => result.current.exitBulkMode())

      expect(result.current.bulkSelectMode).toBe(false)
      expect(result.current.selectedIds.size).toBe(0)
    })
  })

  describe('toggleSelect', () => {
    it('adds an id when not selected', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleSelect(1))
      expect(result.current.selectedIds.has(1)).toBe(true)
    })

    it('removes an id when already selected', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleSelect(1))
      act(() => result.current.toggleSelect(1))
      expect(result.current.selectedIds.has(1)).toBe(false)
    })

    it('handles multiple ids independently', () => {
      const { result } = renderHook(() => useBulkSelect(makeProps()))

      act(() => result.current.toggleSelect(1))
      act(() => result.current.toggleSelect(2))
      act(() => result.current.toggleSelect(1))

      expect(result.current.selectedIds.has(1)).toBe(false)
      expect(result.current.selectedIds.has(2)).toBe(true)
    })
  })

  describe('bulkRelease', () => {
    it('calls releaseMany with the selected ids', async () => {
      const props = makeProps()
      const { result } = renderHook(() => useBulkSelect(props))

      act(() => result.current.toggleSelect(1))
      act(() => result.current.toggleSelect(3))
      await act(() => result.current.bulkRelease())

      expect(props.releaseMany).toHaveBeenCalledWith(expect.arrayContaining([1, 3]))
      expect(props.releaseMany).toHaveBeenCalledTimes(1)
    })

    it('exits bulk mode after release', async () => {
      const props = makeProps()
      const { result } = renderHook(() => useBulkSelect(props))

      act(() => result.current.toggleBulkMode())
      act(() => result.current.toggleSelect(1))
      await act(() => result.current.bulkRelease())

      expect(result.current.bulkSelectMode).toBe(false)
      expect(result.current.selectedIds.size).toBe(0)
    })
  })
})
