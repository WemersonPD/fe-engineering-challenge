import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PokedexToggle from './PokedexToggle'

describe('PokedexToggle', () => {
  it('matches snapshot when inactive', () => {
    const { container } = render(
      <PokedexToggle active={false} onClick={vi.fn()} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when active', () => {
    const { container } = render(
      <PokedexToggle active={true} onClick={vi.fn()} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('has correct aria-label when inactive', () => {
    render(<PokedexToggle active={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Show my Pokédex' })).toBeInTheDocument()
  })

  it('has correct aria-label when active', () => {
    render(<PokedexToggle active={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Show all Pokémon' })).toBeInTheDocument()
  })

  it('has aria-pressed false when inactive', () => {
    render(<PokedexToggle active={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('has aria-pressed true when active', () => {
    render(<PokedexToggle active={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<PokedexToggle active={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
