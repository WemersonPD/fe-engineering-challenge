import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomeLayout from './HomeLayout'

describe('HomeLayout', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <HomeLayout
        topBar={<div>TopBar</div>}
        sidebar={<div>Sidebar</div>}
        content={<div>Content</div>}
        pagination={<div>Pagination</div>}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders topBar inside header', () => {
    render(<HomeLayout topBar={<div>TopBar</div>} />)
    const header = screen.getByRole('banner')
    expect(header).toContainElement(screen.getByText('TopBar'))
  })

  it('renders content inside main', () => {
    render(<HomeLayout content={<div>Content</div>} />)
    const main = screen.getByRole('main')
    expect(main).toContainElement(screen.getByText('Content'))
  })

  it('renders sidebar', () => {
    render(<HomeLayout sidebar={<div>Sidebar</div>} />)
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })

  it('renders pagination when provided', () => {
    render(<HomeLayout pagination={<div>Pagination</div>} />)
    expect(screen.getByText('Pagination')).toBeInTheDocument()
  })

  it('does not render pagination wrapper when pagination is not provided', () => {
    render(<HomeLayout content={<div>Content</div>} />)
    expect(screen.queryByText('Pagination')).not.toBeInTheDocument()
  })

  it('renders skip to main content link', () => {
    render(<HomeLayout />)
    const link = screen.getByText('Skip to main content')
    expect(link).toHaveAttribute('href', '#main-content')

    expect(document.getElementById('main-content')).toBeInTheDocument()
  })
})
