import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PokemonImage from './PokemonImage'

describe('PokemonImage', () => {
  it('matches snapshot (sm, not caught)', () => {
    const { container } = render(
      <PokemonImage src="/bulbasaur.png" alt="Bulbasaur" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot (lg, caught)', () => {
    const { container } = render(
      <PokemonImage src="/bulbasaur.png" alt="Bulbasaur" isCaught size="lg" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('does not render the pokeball when not caught', () => {
    render(<PokemonImage src="/bulbasaur.png" alt="Bulbasaur" />)
    expect(screen.queryByAltText('Caught')).not.toBeInTheDocument()
  })

  it('renders the pokeball when caught', () => {
    render(<PokemonImage src="/bulbasaur.png" alt="Bulbasaur" isCaught />)
    expect(screen.getByAltText('Caught')).toBeInTheDocument()
  })

  describe('sm size', () => {
    it('applies sm size classes', () => {
      render(<PokemonImage src="/bulbasaur.png" alt="Bulbasaur" size="sm" />)
      const img = screen.getByAltText('Bulbasaur')
      expect(img.className).toContain('mix-blend-multiply')
    })

    it('applies sm pokeball size when caught and sm', () => {
      render(
        <PokemonImage
          src="/bulbasaur.png"
          alt="Bulbasaur"
          isCaught
          size="sm"
        />,
      )
      const pokeball = screen.getByAltText('Caught')
      expect(pokeball.className).toContain('w-6')
    })
  })

  describe('lg size', () => {
    it('applies lg size classes', () => {
      render(<PokemonImage src="/bulbasaur.png" alt="Bulbasaur" size="lg" />)
      const img = screen.getByAltText('Bulbasaur')
      expect(img.className).toContain('w-48')
    })

    it('applies lg pokeball size when caught and lg', () => {
      render(
        <PokemonImage
          src="/bulbasaur.png"
          alt="Bulbasaur"
          isCaught
          size="lg"
        />,
      )
      const pokeball = screen.getByAltText('Caught')
      expect(pokeball.className).toContain('w-8')
    })
  })
})
