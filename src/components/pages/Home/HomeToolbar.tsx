import {
  Bars3Icon,
  Squares2X2Icon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import Button from '../../atoms/Button'
import ViewToggle from '../../atoms/ViewToggle'
import ListToolbar from '../../molecules/ListToolbar'

export type ViewMode = 'grid' | 'table'

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

interface HomeToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalPokemon: number
  caughtCount: number
  caughtOnly: boolean
  bulkSelectMode: boolean
  selectedCount: number
  onOpenFilters: () => void
  onClearFilters: () => void
  onToggleBulkMode: () => void
  onBulkRelease: () => void
}

export default function HomeToolbar({
  viewMode,
  onViewModeChange,
  totalPokemon,
  caughtCount,
  caughtOnly,
  bulkSelectMode,
  selectedCount,
  onOpenFilters,
  onClearFilters,
  onToggleBulkMode,
  onBulkRelease,
}: HomeToolbarProps) {
  return (
    <>
      {/* Start  Mobile Filters */}
      <ListToolbar
        trigger={
          <Button
            variant="gray"
            onClick={onOpenFilters}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </Button>
        }
      >
        {(close) => (
          <>
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onViewModeChange(opt.value)
                  close()
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 ${viewMode === opt.value ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}

            <div className="border-t border-gray-100" />

            <button
              type="button"
              onClick={() => {
                onClearFilters()
                close()
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>

            {caughtOnly && (
              <>
                <div className="border-t border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    onToggleBulkMode()
                    close()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {bulkSelectMode ? 'Cancel selection' : 'Select Pokémon'}
                </button>

                {bulkSelectMode && selectedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onBulkRelease()
                      close()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Release {selectedCount}
                  </button>
                )}
              </>
            )}
          </>
        )}
      </ListToolbar>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 shrink-0 sm:hidden">
        <span>
          Available: <strong className="text-gray-900">{totalPokemon}</strong>
        </span>
        <span>
          Caught: <strong className="text-red-600">{caughtCount}</strong>
        </span>
      </div>
      {/* End Mobile Filters */}

      <div className="hidden md:flex items-center justify-between mb-4 shrink-0">
        <ViewToggle
          value={viewMode}
          onChange={onViewModeChange}
          options={VIEW_OPTIONS}
        />

        <div className="flex items-center gap-3 text-sm text-gray-600">
          {bulkSelectMode && selectedCount > 0 && (
            <Button
              variant="red"
              onClick={onBulkRelease}
              className="flex items-center gap-1.5"
            >
              <TrashIcon className="w-4 h-4" />
              Release {selectedCount}
            </Button>
          )}

          {caughtOnly && (
            <Button
              variant={bulkSelectMode ? 'red' : 'gray'}
              onClick={onToggleBulkMode}
            >
              {bulkSelectMode ? 'Cancel' : 'Select'}
            </Button>
          )}

          <span>
            Available: <strong className="text-gray-900">{totalPokemon}</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            Caught: <strong className="text-red-600">{caughtCount}</strong>
          </span>
        </div>
      </div>
    </>
  )
}
