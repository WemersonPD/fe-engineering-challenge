import type { ReactNode } from 'react'

interface DefaultLayoutProps {
  search?: ReactNode
  sidebar?: ReactNode
  content?: ReactNode
}

function DefaultLayout({ search, sidebar, content }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:underline"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="w-full px-4 py-4 sm:px-6 lg:px-8 shrink-0"
      >
        {search}
      </header>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 pb-8 min-h-0 flex-1">
        <aside
          aria-label="Filters"
          className="w-full lg:w-64 shrink-0 flex flex-col"
        >
          <nav aria-label="Product filters" className="flex flex-col flex-1">
            {sidebar}
          </nav>
        </aside>

        <main id="main-content" className="flex-1 min-w-0 lg:overflow-y-auto">
          {content}
        </main>
      </div>
    </div>
  )
}

export default DefaultLayout
