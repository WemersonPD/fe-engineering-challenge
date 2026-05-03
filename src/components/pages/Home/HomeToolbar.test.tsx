import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeToolbar from './HomeToolbar'

const defaultProps = {
  viewMode: 'grid' as const,
  onViewModeChange: vi.fn(),
  totalPokemon: 151,
  caughtCount: 10,
  caughtOnly: false,
  bulkSelectMode: false,
  selectedCount: 0,
  onOpenFilters: vi.fn(),
  onClearFilters: vi.fn(),
  onToggleBulkMode: vi.fn(),
  onBulkRelease: vi.fn(),
}

beforeEach(() => vi.clearAllMocks())

describe('HomeToolbar', () => {
  it('matches snapshot', () => {
    const { container } = render(<HomeToolbar {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  describe('mobile filters button', () => {
    it('renders the Filters button', () => {
      render(<HomeToolbar {...defaultProps} />)
      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it('calls onOpenFilters when Filters button is clicked', () => {
      const onOpenFilters = vi.fn()
      render(<HomeToolbar {...defaultProps} onOpenFilters={onOpenFilters} />)
      fireEvent.click(screen.getByText('Filters'))
      expect(onOpenFilters).toHaveBeenCalledOnce()
    })
  })

  describe('more options menu', () => {
    it('shows view mode options when more options is opened', () => {
      render(<HomeToolbar {...defaultProps} />)
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.getByText('Grid view')).toBeInTheDocument()
      expect(screen.getByText('Table view')).toBeInTheDocument()
    })

    it('calls onViewModeChange and closes menu when a view option is clicked', () => {
      const onViewModeChange = vi.fn()
      render(
        <HomeToolbar {...defaultProps} onViewModeChange={onViewModeChange} />,
      )
      fireEvent.click(screen.getByLabelText('More options'))
      fireEvent.click(screen.getByText('Table view'))
      expect(onViewModeChange).toHaveBeenCalledWith('table')
      expect(screen.queryByText('Table view')).not.toBeInTheDocument()
    })

    it('shows Clear filters option in menu', () => {
      render(<HomeToolbar {...defaultProps} />)
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.getByText('Clear filters')).toBeInTheDocument()
    })

    it('calls onClearFilters and closes menu when Clear filters is clicked', () => {
      const onClearFilters = vi.fn()
      render(<HomeToolbar {...defaultProps} onClearFilters={onClearFilters} />)
      fireEvent.click(screen.getByLabelText('More options'))
      fireEvent.click(screen.getByText('Clear filters'))
      expect(onClearFilters).toHaveBeenCalledOnce()
      expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
    })

    it('does not show Select Pokémon when caughtOnly is false', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly={false} />)
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.queryByText('Select Pokémon')).not.toBeInTheDocument()
    })

    it('shows Select Pokémon in menu when caughtOnly is true', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly />)
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.getByText('Select Pokémon')).toBeInTheDocument()
    })

    it('calls onToggleBulkMode and closes menu when Select Pokémon is clicked', () => {
      const onToggleBulkMode = vi.fn()
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          onToggleBulkMode={onToggleBulkMode}
        />,
      )
      fireEvent.click(screen.getByLabelText('More options'))
      fireEvent.click(screen.getByText('Select Pokémon'))
      expect(onToggleBulkMode).toHaveBeenCalledOnce()
      expect(screen.queryByText('Select Pokémon')).not.toBeInTheDocument()
    })

    it('shows Cancel selection in menu when bulkSelectMode is true', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly bulkSelectMode />)
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.getByText('Cancel selection')).toBeInTheDocument()
    })

    it('does not show Release button in menu when selectedCount is 0', () => {
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          bulkSelectMode
          selectedCount={0}
        />,
      )
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.queryByText(/Release/)).not.toBeInTheDocument()
    })

    it('shows Release button in menu when bulkSelectMode and selectedCount > 0', () => {
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          bulkSelectMode
          selectedCount={3}
        />,
      )
      fireEvent.click(screen.getByLabelText('More options'))
      expect(screen.getAllByText('Release 3').length).toBeGreaterThan(0)
    })

    it('calls onBulkRelease and closes menu when Release is clicked in menu', () => {
      const onBulkRelease = vi.fn()
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          bulkSelectMode
          selectedCount={3}
          onBulkRelease={onBulkRelease}
        />,
      )
      fireEvent.click(screen.getByLabelText('More options'))
      // Click the menu item (first match is the mobile menu button)
      fireEvent.click(screen.getAllByText('Release 3')[0])
      expect(onBulkRelease).toHaveBeenCalledOnce()
      // Menu closed — menu-only items are gone
      expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
    })
  })

  describe('desktop toolbar', () => {
    it('renders the Grid view toggle button', () => {
      render(<HomeToolbar {...defaultProps} viewMode="grid" />)
      expect(screen.getByLabelText('Grid view')).toBeInTheDocument()
    })

    it('renders the Table view toggle button', () => {
      render(<HomeToolbar {...defaultProps} viewMode="grid" />)
      expect(screen.getByLabelText('Table view')).toBeInTheDocument()
    })

    it('calls onViewModeChange when a view toggle is clicked', () => {
      const onViewModeChange = vi.fn()
      render(
        <HomeToolbar {...defaultProps} onViewModeChange={onViewModeChange} />,
      )
      fireEvent.click(screen.getByLabelText('Table view'))
      expect(onViewModeChange).toHaveBeenCalledWith('table')
    })

    it('does not show desktop Select button when caughtOnly is false', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly={false} />)
      expect(
        screen.queryByRole('button', { name: 'Select' }),
      ).not.toBeInTheDocument()
    })

    it('shows desktop Select button when caughtOnly is true', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly />)
      expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument()
    })

    it('calls onToggleBulkMode when desktop Select button is clicked', () => {
      const onToggleBulkMode = vi.fn()
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          onToggleBulkMode={onToggleBulkMode}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Select' }))
      expect(onToggleBulkMode).toHaveBeenCalledOnce()
    })

    it('shows desktop Cancel button when bulkSelectMode is true', () => {
      render(<HomeToolbar {...defaultProps} caughtOnly bulkSelectMode />)
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('does not show desktop Release button when selectedCount is 0', () => {
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          bulkSelectMode
          selectedCount={0}
        />,
      )
      const releaseButtons = screen.queryAllByRole('button', {
        name: /Release/,
      })
      expect(releaseButtons).toHaveLength(0)
    })

    it('calls onBulkRelease when desktop Release button is clicked', () => {
      const onBulkRelease = vi.fn()
      render(
        <HomeToolbar
          {...defaultProps}
          caughtOnly
          bulkSelectMode
          selectedCount={5}
          onBulkRelease={onBulkRelease}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /Release 5/ }))
      expect(onBulkRelease).toHaveBeenCalledOnce()
    })
  })
})
