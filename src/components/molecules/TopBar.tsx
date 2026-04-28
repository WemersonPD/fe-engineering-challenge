import { useState } from 'react'
import { Bars3Icon, Squares2X2Icon } from '@heroicons/react/24/outline'
import ViewToggle from '../atoms/ViewToggle'

export type ViewMode = 'grid' | 'table'

interface TopBarProps {
  onViewModeChange: (mode: ViewMode) => void
  totalCount: number
  caughtCount: number
}

const VIEW_OPTIONS = [
  {
    value: 'grid' as ViewMode,
    label: 'Grid view',
    icon: <Squares2X2Icon className="w-4 h-4" />,
  },
  {
    value: 'table' as ViewMode,
    label: 'Table view',
    icon: <Bars3Icon className="w-4 h-4" />,
  },
]

function TopBar({ onViewModeChange, totalCount, caughtCount }: TopBarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode)
    onViewModeChange(mode)
  }

  return (
    <div className="flex items-center justify-end gap-4">
      <ViewToggle
        value={viewMode}
        onChange={handleViewModeChange}
        options={VIEW_OPTIONS}
      />

      <div className="flex items-center gap-3 text-sm text-gray-600 whitespace-nowrap">
        <span>
          Available: <strong className="text-gray-900">{totalCount}</strong>
        </span>
        <span className="text-gray-300">|</span>
        <span>
          Caught: <strong className="text-red-600">{caughtCount}</strong>
        </span>
      </div>
    </div>
  )
}

export default TopBar
