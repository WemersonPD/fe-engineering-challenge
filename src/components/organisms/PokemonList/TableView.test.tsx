import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import TableView from './TableView'
import type { CaughtPokemon, Pokemon } from '../../../types/pokemon'
import type { Sort } from '../../../types/filters'
import type { ViewProps } from './types'
import * as shareUtils from '../../../utils/share'
import { toLocalDateString } from '../../../utils/date'

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

const caughtEntry: CaughtPokemon = {
  id: 1,
  name: 'mr-mime',
  caughtAt: '2026-04-28T10:00:00.000Z',
  note: '',
}

const defaultProps: ViewProps = {
  pokemon: [pokemon],
  caught: new Map<number, CaughtPokemon>(),
  sort: { field: 'id', order: 'asc' } as Sort,
  onSortChange: vi.fn(),
  onCatch: vi.fn(),
  onRelease: vi.fn(),
  selectedIds: new Set<number>(),
  onToggleSelect: vi.fn(),
}

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

beforeEach(() => vi.clearAllMocks())

describe('TableView', () => {
  it('matches snapshot', () => {
    const { container } = renderWithRouter(<TableView {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it('formats hyphenated names', () => {
    renderWithRouter(<TableView {...defaultProps} />)
    expect(screen.getByText('Mr mime')).toBeInTheDocument()
  })

  it('shows Catch for uncaught and calls onCatch', () => {
    renderWithRouter(<TableView {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /catch/i }))
    expect(defaultProps.onCatch).toHaveBeenCalledWith(pokemon)
  })

  it('shows Release for caught and calls onRelease', () => {
    const caught = new Map([[1, caughtEntry]])
    renderWithRouter(<TableView {...defaultProps} caught={caught} />)
    fireEvent.click(screen.getByRole('button', { name: /release/i }))
    expect(defaultProps.onRelease).toHaveBeenCalledWith(1)
  })

  it('shows caught date or — depending on caught state', () => {
    const caught = new Map([[1, caughtEntry]])
    const { rerender } = renderWithRouter(<TableView {...defaultProps} />)
    expect(screen.getByText('—')).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <TableView {...defaultProps} caught={caught} />
      </MemoryRouter>,
    )
    expect(
      screen.getByText(toLocalDateString(caughtEntry.caughtAt)),
    ).toBeInTheDocument()
  })

  describe('share button', () => {
    afterEach(() => vi.restoreAllMocks())

    it('renders the share button', () => {
      renderWithRouter(<TableView {...defaultProps} />)
      expect(
        screen.getByRole('button', { name: 'Share Mr mime' }),
      ).toBeInTheDocument()
    })

    it('calls sharePokemon with the pokemon id and name when clicked', () => {
      const spy = vi
        .spyOn(shareUtils, 'sharePokemon')
        .mockResolvedValueOnce({ success: true, message: '' })

      renderWithRouter(<TableView {...defaultProps} />)
      fireEvent.click(screen.getByRole('button', { name: 'Share Mr mime' }))

      expect(spy).toHaveBeenCalledWith(pokemon.id, 'Mr mime')
      expect(spy).toHaveBeenCalledOnce()

      spy.mockRestore()
    })
  })

  describe('bulk select checkbox', () => {
    it('does not render checkboxes when onToggleSelect is undefined', () => {
      renderWithRouter(
        <TableView {...defaultProps} onToggleSelect={undefined} />,
      )
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('renders a checkbox for each pokemon when onToggleSelect is provided', () => {
      renderWithRouter(<TableView {...defaultProps} />)
      expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    })

    it('calls onToggleSelect with the pokemon id when checkbox is changed', () => {
      const onToggleSelect = vi.fn()
      renderWithRouter(
        <TableView {...defaultProps} onToggleSelect={onToggleSelect} />,
      )
      fireEvent.click(screen.getByRole('checkbox'))
      expect(onToggleSelect).toHaveBeenCalledWith(1)
    })
  })

  describe('sorting', () => {
    it('sorts asc on first click, toggles to desc on second', () => {
      const onSortChange = vi.fn()
      renderWithRouter(
        <TableView
          {...defaultProps}
          sort={{ field: 'id', order: 'asc' }}
          onSortChange={onSortChange}
        />,
      )

      fireEvent.click(screen.getByRole('columnheader', { name: /name/i }))
      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', order: 'asc' })

      fireEvent.click(screen.getByRole('columnheader', { name: /name/i }))
      expect(onSortChange).toHaveBeenCalledWith({ field: 'name', order: 'asc' })
    })

    it('does not sort non-sortable columns', () => {
      const onSortChange = vi.fn()
      renderWithRouter(
        <TableView {...defaultProps} onSortChange={onSortChange} />,
      )
      fireEvent.click(screen.getByRole('columnheader', { name: /weight/i }))
      expect(onSortChange).not.toHaveBeenCalled()
    })
  })
})
