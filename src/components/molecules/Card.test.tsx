import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card'
import type { Pokemon, CaughtPokemon } from '../../types/pokemon'

vi.mock('../../utils/share', () => ({
  sharePokemon: vi.fn().mockResolvedValue({ success: true, message: '' }),
}))

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  color: 'green',
  image: 'bulbasaur.png',
  height: 7,
  weight: 69,
  hp: 45,
  speed: 45,
  attack: 49,
  defense: 49,
  specialAttack: 65,
  specialDefense: 65,
  types: ['grass', 'poison'],
}

const mockCaught: CaughtPokemon = {
  id: 1,
  name: 'bulbasaur',
  caughtAt: '2024-01-01T00:00:00Z',
  note: '',
}

describe('Card component', () => {
  it('renders the pokemon basic data', () => {
    render(<Card pokemon={mockPokemon} onCatch={vi.fn()} onRelease={vi.fn()} />)

    expect(screen.getByRole('img', { name: 'Bulbasaur' })).toHaveAttribute('src', 'bulbasaur.png')
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('#0001')).toBeInTheDocument()
    expect(screen.getByText('45 HP')).toBeInTheDocument()
    expect(screen.getByText(/Length 7 m/)).toBeInTheDocument()
    expect(screen.getByText(/Weight: 69 kg/)).toBeInTheDocument()
    expect(screen.getByText(/Speed 45/)).toBeInTheDocument()
    expect(screen.getByText(/Attack 49/)).toBeInTheDocument()
    expect(screen.getByText(/Defense 49/)).toBeInTheDocument()
    expect(screen.getByText(/Special Attack 65/)).toBeInTheDocument()
    expect(screen.getByText(/Special Defense 65/)).toBeInTheDocument()
    expect(screen.getByText(/Grass/)).toBeInTheDocument()
    expect(screen.getByText(/Poison/)).toBeInTheDocument()
  })

  it('calls onCatch with the pokemon when Catch is clicked', () => {
    const onCatch = vi.fn()

    render(<Card pokemon={mockPokemon} onCatch={onCatch} onRelease={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Catch' }))

    expect(onCatch).toHaveBeenCalledOnce()
    expect(onCatch).toHaveBeenCalledWith(mockPokemon)
  })

  it('calls onRelease with the pokemon id when Release is clicked', () => {
    const onRelease = vi.fn()

    render(
      <Card
        pokemon={mockPokemon}
        caught={mockCaught}
        onCatch={vi.fn()}
        onRelease={onRelease}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Release' }))

    expect(onRelease).toHaveBeenCalledOnce()
    expect(onRelease).toHaveBeenCalledWith(mockPokemon.id)
  })

  describe('Card share button', () => {
    it('renders the share button', () => {
      render(<Card pokemon={mockPokemon} onCatch={vi.fn()} onRelease={vi.fn()} />)

      expect(screen.getByRole('button', { name: 'Share Bulbasaur' })).toBeInTheDocument()
    })

    it('calls sharePokemon with the pokemon id and name when share is clicked', async () => {
      const { sharePokemon } = await import('../../utils/share')

      render(<Card pokemon={mockPokemon} onCatch={vi.fn()} onRelease={vi.fn()} />)

      fireEvent.click(screen.getByRole('button', { name: 'Share Bulbasaur' }))

      expect(sharePokemon).toHaveBeenCalledWith(mockPokemon.id, 'Bulbasaur')
    })
  })

  describe('Card checkbox', () => {
    it('does not render a checkbox when the pokemon is not caught', () => {
      render(
        <Card
          pokemon={mockPokemon}
          onCatch={vi.fn()}
          onRelease={vi.fn()}
          onToggleSelect={vi.fn()}
        />,
      )

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('does not render a checkbox when onToggleSelect is not provided', () => {
      render(
        <Card
          pokemon={mockPokemon}
          caught={mockCaught}
          onCatch={vi.fn()}
          onRelease={vi.fn()}
        />,
      )

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('renders a checkbox when the pokemon is caught and onToggleSelect is provided', () => {
      render(
        <Card
          pokemon={mockPokemon}
          caught={mockCaught}
          onCatch={vi.fn()}
          onRelease={vi.fn()}
          onToggleSelect={vi.fn()}
        />,
      )

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('calls onToggleSelect with the pokemon id when the checkbox is clicked', () => {
      const onToggleSelect = vi.fn()

      render(
        <Card
          pokemon={mockPokemon}
          caught={mockCaught}
          onCatch={vi.fn()}
          onRelease={vi.fn()}
          onToggleSelect={onToggleSelect}
        />,
      )

      fireEvent.click(screen.getByRole('checkbox'))

      expect(onToggleSelect).toHaveBeenCalledOnce()
      expect(onToggleSelect).toHaveBeenCalledWith(mockPokemon.id)
    })
  })
})
