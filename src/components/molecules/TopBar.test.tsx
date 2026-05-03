import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TopBar from './TopBar'

describe('TopBar', () => {
  it('matches snapshot', () => {
    const { container } = render(<TopBar onExport={vi.fn()} />)
    expect(container).toMatchSnapshot()
  })

  it('renders the pokeball image', () => {
    render(<TopBar onExport={vi.fn()} />)
    expect(screen.getByAltText('Pokeball')).toBeInTheDocument()
  })

  it('renders the export button', () => {
    render(<TopBar onExport={vi.fn()} />)
    expect(screen.getByText('Export Pokédex')).toBeInTheDocument()
  })

  it('calls onExport when the export button is clicked', () => {
    const onExport = vi.fn()
    render(<TopBar onExport={onExport} />)
    fireEvent.click(screen.getByText('Export Pokédex'))
    expect(onExport).toHaveBeenCalledOnce()
  })
})
