import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('matches snapshot', () => {
    const { container } = render(<Sidebar><p>Content</p></Sidebar>)
    expect(container).toMatchSnapshot()
  })

  it('renders the desktop aside always', () => {
    render(<Sidebar><p>Content</p></Sidebar>)
    const asides = screen.getAllByRole('complementary', { name: 'Filters' })
    expect(asides.length).toBeGreaterThanOrEqual(1)
  })

  it('renders children in the desktop aside', () => {
    render(<Sidebar><p>Desktop Content</p></Sidebar>)
    expect(screen.getByText('Desktop Content')).toBeInTheDocument()
  })

  it('does not show mobile panel when isOpen is false', () => {
    render(<Sidebar isOpen={false}><p>Content</p></Sidebar>)
    expect(screen.queryByLabelText('Close filters')).not.toBeInTheDocument()
  })

  it('shows mobile panel when isOpen is true', () => {
    render(<Sidebar isOpen><p>Mobile Content</p></Sidebar>)
    expect(screen.getByLabelText('Close filters')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<Sidebar isOpen onClose={onClose}><p>Content</p></Sidebar>)
    fireEvent.click(screen.getByLabelText('Close filters'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Sidebar isOpen onClose={onClose}><p>Content</p></Sidebar>)
    fireEvent.click(document.querySelector('[aria-hidden="true"]')!)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders children inside the mobile panel when open', () => {
    render(<Sidebar isOpen><p>Filter Options</p></Sidebar>)
    expect(screen.getAllByText('Filter Options')).toHaveLength(2)
  })
})
