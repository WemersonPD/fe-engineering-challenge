import type { ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface HomeLayoutProps {
  topBar?: ReactNode
  sidebar?: ReactNode
  content?: ReactNode
  pagination?: ReactNode
  isSidebarOpen?: boolean
  onCloseSidebar?: () => void
}

function HomeLayout({
  topBar,
  sidebar,
  content,
  pagination,
  isSidebarOpen = false,
  onCloseSidebar,
}: HomeLayoutProps) {
  return (
    <div className="relative h-screen flex flex-col bg-gray-50 overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:underline"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="w-full px-4 py-4 sm:px-6 lg:px-8 shrink-0 border-b border-gray-200 flex items-center gap-3"
      >
        {topBar}
      </header>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={onCloseSidebar}
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
                  onClick={onCloseSidebar}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              {sidebar}
            </aside>
          </div>
        )}

        <aside
          aria-label="Filters"
          className="hidden lg:block w-64 shrink-0 py-6 px-4 border-r border-gray-200 overflow-y-auto"
        >
          {sidebar}
        </aside>

        <div className="flex flex-col flex-1 min-h-0 lg:px-8">
          <main
            id="main-content"
            className="flex-1 px-4 sm:px-0 min-h-0 overflow-hidden py-6 flex flex-col"
          >
            {content}
          </main>

          {pagination && (
            <div className="shrink-0 py-4 border-t border-gray-200">
              {pagination}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
