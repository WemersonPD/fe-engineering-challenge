import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from './index'
import { useAllPokemon } from '../../../hooks/useAllPokemon'
import { usePokedex } from '../../../hooks/usePokedex'
import { useBulkSelect } from '../../../hooks/useBulkSelect'
import type { Pokemon, CaughtPokemon } from '../../../types/pokemon'

vi.mock('../../../hooks/useAllPokemon')
vi.mock('../../../hooks/usePokedex')
vi.mock('../../../hooks/useBulkSelect')
vi.mock('../../../hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value,
}))

vi.mock('../../organisms/PokemonList', () => ({
  default: () => <div data-testid="pokemon-list" />,
}))

vi.mock('../../organisms/FilterPanel', () => ({
  default: () => <div data-testid="filter-panel" />,
}))

vi.mock('../../molecules/TopBar', () => ({
  default: () => <div data-testid="top-bar" />,
}))

vi.mock('../../atoms/PokedexToggle', () => ({
  default: ({
    active,
    onClick,
  }: {
    active: boolean
    onClick: () => void
  }) => (
    <button
      data-testid="pokedex-toggle"
      aria-pressed={active}
      onClick={onClick}
    >
      Pokédex Toggle
    </button>
  ),
}))

vi.mock('./HomeToolbar', () => ({
  default: ({
    onOpenFilters,
    onClearFilters,
    onViewModeChange,
  }: {
    onOpenFilters: () => void
    onClearFilters: () => void
    onViewModeChange: (mode: string) => void
  }) => (
    <div data-testid="home-toolbar">
      <button onClick={onOpenFilters}>Open Filters</button>
      <button onClick={onClearFilters}>Clear Filters</button>
      <button onClick={() => onViewModeChange('table')}>Switch to Table</button>
    </div>
  ),
}))

function makePokemon(id: number): Pokemon {
  return {
    id,
    name: `pokemon-${id}`,
    color: 'red',
    image: '',
    height: 1,
    weight: 1,
    hp: 50,
    attack: 50,
    defense: 50,
    specialAttack: 50,
    specialDefense: 50,
    speed: 50,
    types: ['normal'],
  }
}

const defaultPokedexMock = {
  caught: new Map<number, CaughtPokemon>(),
  caughtCount: 0,
  isCaught: vi.fn(),
  catch: vi.fn(),
  release: vi.fn(),
  releaseMany: vi.fn(),
  updateNote: vi.fn(),
  exportPokedex: vi.fn(),
  importPokedex: vi.fn(),
}

const defaultBulkSelectMock = {
  bulkSelectMode: false,
  selectedIds: new Set<number>(),
  toggleBulkMode: vi.fn(),
  exitBulkMode: vi.fn(),
  toggleSelect: vi.fn(),
  bulkRelease: vi.fn(),
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(usePokedex).mockReturnValue(defaultPokedexMock)
    vi.mocked(useBulkSelect).mockReturnValue(defaultBulkSelectMock)
  })

  describe('loading and error states', () => {
    it('shows loading indicator while pokemon are being fetched', () => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: [],
        totalPokemon: 0,
        loading: true,
        error: null,
      })

      render(<Home />)

      expect(screen.getByRole('status')).toHaveTextContent('Loading Pokémon...')
      expect(screen.queryByTestId('pokemon-list')).not.toBeInTheDocument()
    })

    it('shows error message when loading fails', () => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: [],
        totalPokemon: 0,
        loading: false,
        error: 'Network error',
      })

      render(<Home />)

      expect(screen.getByRole('alert')).toHaveTextContent('Network error')
      expect(screen.queryByTestId('pokemon-list')).not.toBeInTheDocument()
    })

    it('renders PokemonList when data is loaded', () => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: [makePokemon(1)],
        totalPokemon: 1,
        loading: false,
        error: null,
      })

      render(<Home />)

      expect(screen.getByTestId('pokemon-list')).toBeInTheDocument()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('PokedexToggle', () => {
    beforeEach(() => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: [],
        totalPokemon: 0,
        loading: false,
        error: null,
      })
    })

    it('renders with caughtOnly inactive by default', () => {
      render(<Home />)

      expect(screen.getByTestId('pokedex-toggle')).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('activates caughtOnly when toggled', () => {
      render(<Home />)

      fireEvent.click(screen.getByTestId('pokedex-toggle'))

      expect(screen.getByTestId('pokedex-toggle')).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    it('deactivates caughtOnly when toggled a second time', () => {
      render(<Home />)

      fireEvent.click(screen.getByTestId('pokedex-toggle'))
      fireEvent.click(screen.getByTestId('pokedex-toggle'))

      expect(screen.getByTestId('pokedex-toggle')).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })
  })

  describe('sidebar', () => {
    beforeEach(() => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: [],
        totalPokemon: 0,
        loading: false,
        error: null,
      })
    })

    it('mobile sidebar is closed by default', () => {
      render(<Home />)

      expect(
        screen.queryByRole('button', { name: 'Close filters' }),
      ).not.toBeInTheDocument()
    })

    it('opens mobile sidebar when Open Filters is clicked', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Open Filters'))

      expect(
        screen.getByRole('button', { name: 'Close filters' }),
      ).toBeInTheDocument()
    })

    it('closes mobile sidebar when Close filters is clicked', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Open Filters'))
      fireEvent.click(screen.getByRole('button', { name: 'Close filters' }))

      expect(
        screen.queryByRole('button', { name: 'Close filters' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('pagination', () => {
    const NINE_POKEMON = Array.from({ length: 9 }, (_, i) => makePokemon(i + 1))

    beforeEach(() => {
      vi.mocked(useAllPokemon).mockReturnValue({
        pokemon: NINE_POKEMON,
        totalPokemon: 9,
        loading: false,
        error: null,
      })
    })

    it('starts on the first page', () => {
      render(<Home />)

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('navigates to next page when Next is clicked', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Next'))

      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
    })

    it('navigates back when Previous is clicked', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Next'))
      fireEvent.click(screen.getByText('Previous'))

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('resets to page 1 when filters change via PokedexToggle', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Next'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('pokedex-toggle'))

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('resets to page 1 when Clear Filters is clicked', () => {
      render(<Home />)

      fireEvent.click(screen.getByTestId('pokedex-toggle'))
      fireEvent.click(screen.getByText('Next'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Clear Filters'))

      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    it('resets to page 1 when view mode changes', () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Next'))
      expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Switch to Table'))

      expect(screen.getByText(/^Page 1 of/)).toBeInTheDocument()
    })
  })
})
