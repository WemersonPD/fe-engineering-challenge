import { useState, useCallback } from 'react'

interface UseBulkSelectProps {
  releaseMany: (ids: number[]) => Promise<void>
}

export function useBulkSelect({ releaseMany }: UseBulkSelectProps) {
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const toggleBulkMode = useCallback(() => {
    setSelectedIds(new Set())

    setBulkSelectMode((prev) => !prev)
  }, [])

  const exitBulkMode = useCallback(() => {
    setBulkSelectMode(false)
    setSelectedIds(new Set())
  }, [])

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }, [])

  const bulkRelease = useCallback(async () => {
    await releaseMany([...selectedIds])
    exitBulkMode()
  }, [releaseMany, selectedIds, exitBulkMode])

  return {
    bulkSelectMode,
    selectedIds,
    toggleBulkMode,
    exitBulkMode,
    toggleSelect,
    bulkRelease,
  }
}
