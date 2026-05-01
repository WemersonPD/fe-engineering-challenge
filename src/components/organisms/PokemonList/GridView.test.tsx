import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GridView from './GridView'
import type { CaughtPokemon, Pokemon } from '../../../types/pokemon'
import type { Sort } from '../../../types/filters'

const makePokemon = (id: number, name: string): Pokemon => ({
  id,
  name,
  color: 'red',
  image: `${name}.png`,
  height: 1,
  weight: 10,
  hp: 50,
  speed: 50,
  attack: 50,
  defense: 50,
  specialAttack: 50,
  specialDefense: 50,
  types: ['fire'],
})

const defaultProps = {
  pokemon: [makePokemon(1, 'charmander'), makePokemon(2, 'charmeleon')],
  caught: new Map<number, CaughtPokemon>(),
  sort: { field: 'id', order: 'asc' } as Sort,
  onSortChange: vi.fn(),
  onCatch: vi.fn(),
  onRelease: vi.fn(),
}

beforeEach(() => vi.clearAllMocks())

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('GridView', () => {
  it('matches snapshot', () => {
    const { container } = renderWithRouter(<GridView {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it('renders a card for each pokemon', () => {
    renderWithRouter(<GridView {...defaultProps} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('toggles sort order when the order button is clicked', () => {
    const onSortChange = vi.fn()
    renderWithRouter(<GridView {...defaultProps} onSortChange={onSortChange} />)
    fireEvent.click(screen.getByRole('button', { name: /sort ascending/i }))
    expect(onSortChange).toHaveBeenCalledWith({ field: 'id', order: 'desc' })
  })

  it('updates sort field when dropdown changes', () => {
    const onSortChange = vi.fn()
    renderWithRouter(<GridView {...defaultProps} onSortChange={onSortChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'name' } })
    expect(onSortChange).toHaveBeenCalledWith({ field: 'name', order: 'asc' })
  })
})
