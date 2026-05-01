import type { ReactNode } from 'react'

interface DefaultLayoutProps {
  topBar?: ReactNode
  sidebar?: ReactNode
  content?: ReactNode
  pagination?: ReactNode
}

function DefaultLayout({
  topBar,
  sidebar,
  content,
  pagination,
}: DefaultLayoutProps) {
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

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 px-4 sm:px-6 lg:px-8">
        <aside
          aria-label="Filters"
          className="w-full lg:w-64 shrink-0 py-6 lg:border-r border-gray-200 lg:overflow-y-auto"
        >
          {sidebar}
        </aside>

        <div className="flex flex-col flex-1 min-h-0 lg:px-8">
          <main
            id="main-content"
            className="flex-1 min-h-0 overflow-hidden py-6 flex flex-col"
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

export default DefaultLayout
