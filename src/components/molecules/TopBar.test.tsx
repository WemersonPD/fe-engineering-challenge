import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TopBar from './TopBar'

const defaultProps = { onExport: vi.fn(), onImport: vi.fn() }

describe('TopBar', () => {
  it('matches snapshot', () => {
    const { container } = render(<TopBar {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it('renders the pokeball image', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByAltText('Pokeball')).toBeInTheDocument()
  })

  it('renders the export button', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('Export Pokédex')).toBeInTheDocument()
  })

  it('calls onExport when the export button is clicked', () => {
    const onExport = vi.fn()
    render(<TopBar onExport={onExport} onImport={vi.fn()} />)
    fireEvent.click(screen.getByText('Export Pokédex'))
    expect(onExport).toHaveBeenCalledOnce()
  })

  it('renders the import button', () => {
    render(<TopBar {...defaultProps} />)
    expect(screen.getByText('Import Pokédex')).toBeInTheDocument()
  })

  it('calls onImport with the selected file when a file is chosen', () => {
    const onImport = vi.fn()
    render(<TopBar onExport={vi.fn()} onImport={onImport} />)

    const file = new File(['ID,Name\n1,Bulbasaur'], 'pokedex.csv', { type: 'text/csv' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    expect(onImport).toHaveBeenCalledWith(file)
  })
})
