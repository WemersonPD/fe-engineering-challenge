import type { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  children?: ReactNode
  isOpen?: boolean
  onClose?: () => void
}

function Sidebar({ children, isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Start Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside
            aria-label="Filters"
            className="relative z-10 w-full max-w-sm bg-white overflow-y-auto py-6 px-4"
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {children}
          </aside>
        </div>
      )}
      {/* End Mobile Sidebar */}

      <aside
        aria-label="Filters"
        className="hidden lg:block w-64 shrink-0 py-6 px-4 border-r border-gray-200 overflow-y-auto"
      >
        {children}
      </aside>
    </>
  )
}

export default Sidebar
