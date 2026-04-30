import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TableView from './TableView'
import type { CaughtPokemon, Pokemon } from '../../../types/pokemon'
import type { Sort } from '../../../types/filters'

const pokemon: Pokemon = {
  id: 1,
  name: 'mr-mime',
  color: 'pink',
  image: 'mr-mime.png',
  height: 1.3,
  weight: 54.5,
  hp: 40,
  speed: 90,
  attack: 45,
  defense: 65,
  specialAttack: 100,
  specialDefense: 120,
  types: ['psychic'],
}

const caughtEntry: CaughtPokemon = { id: 1, name: 'mr-mime', caughtAt: '2026-04-28T10:00:00.000Z', note: '' }

const defaultProps = {
  pokemon: [pokemon],
  caught: new Map<number, CaughtPokemon>(),
  sort: { field: 'id', order: 'asc' } as Sort,
  onSortChange: vi.fn(),
  onCatch: vi.fn(),
  onRelease: vi.fn(),
}

beforeEach(() => vi.clearAllMocks())

describe('TableView', () => {
  it('matches snapshot', () => {
    const { container } = render(<TableView {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it('formats hyphenated names', () => {
    render(<TableView {...defaultProps} />)
    expect(screen.getByText('mr mime')).toBeInTheDocument()
  })

  it('shows Catch for uncaught and calls onCatch', () => {
    render(<TableView {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /catch/i }))
    expect(defaultProps.onCatch).toHaveBeenCalledWith(pokemon)
  })

  it('shows Release for caught and calls onRelease', () => {
    const caught = new Map([[1, caughtEntry]])
    render(<TableView {...defaultProps} caught={caught} />)
    fireEvent.click(screen.getByRole('button', { name: /release/i }))
    expect(defaultProps.onRelease).toHaveBeenCalledWith(1)
  })

  it('shows caught date or — depending on caught state', () => {
    const caught = new Map([[1, caughtEntry]])
    const { rerender } = render(<TableView {...defaultProps} />)
    expect(screen.getByText('—')).toBeInTheDocument()

    rerender(<TableView {...defaultProps} caught={caught} />)
    expect(screen.getByText(new Date(caughtEntry.caughtAt).toLocaleDateString())).toBeInTheDocument()
  })

  describe('sorting', () => {
    it('sorts asc on first click, toggles to desc on second', () => {
      const onSortChange = vi.fn()
      render(<TableView {...defaultProps} sort={{ field: 'id', order: 'asc' }} onSortChange={onSortChange} />)

      fireEvent.click(screen.getByRole('columnheader', { name: /name/i }))
      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', order: 'asc' })

      fireEvent.click(screen.getByRole('columnheader', { name: /name/i }))
      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', order: 'asc' })
    })

    it('does not sort non-sortable columns', () => {
      const onSortChange = vi.fn()
      render(<TableView {...defaultProps} onSortChange={onSortChange} />)
      fireEvent.click(screen.getByRole('columnheader', { name: /weight/i }))
      expect(onSortChange).not.toHaveBeenCalled()
    })
  })
})
