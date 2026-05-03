import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useParams, useNavigate } from 'react-router-dom'
import { usePokemon } from '../../hooks/usePokemon'
import { usePokedex } from '../../hooks/usePokedex'
import PokemonDetails from './PokemonDetails'
import * as shareUtils from '../../utils/share'
import type { Pokemon, CaughtPokemon } from '../../types/pokemon'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}))
vi.mock('../../hooks/usePokemon')
vi.mock('../../hooks/usePokedex')

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

const mockCaughtPokemon: CaughtPokemon = {
  id: 1,
  name: 'bulbasaur',
  caughtAt: '2026-05-03T00:00:00.000Z',
  note: 'My note',
}

type PokedexReturn = ReturnType<typeof usePokedex>

const makePokedex = (overrides?: Partial<PokedexReturn>): PokedexReturn => ({
  caught: new Map<number, CaughtPokemon>(),
  caughtCount: 0,
  isCaught: vi.fn().mockReturnValue(false),
  catch: vi.fn().mockResolvedValueOnce(undefined),
  release: vi.fn().mockResolvedValueOnce(undefined),
  releaseMany: vi.fn().mockResolvedValueOnce(undefined),
  updateNote: vi.fn().mockResolvedValueOnce(undefined),
  exportPokedex: vi.fn(),
  importPokedex: vi.fn(),
  ...overrides,
})

const mockNavigate = vi.fn()

describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useParams).mockReturnValueOnce({ id: '1' })
    vi.mocked(useNavigate).mockReturnValueOnce(mockNavigate)
  })

  describe('loading state', () => {
    it('shows loading status while data is being fetched', () => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: null,
        loading: true,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())

      render(<PokemonDetails />)

      expect(screen.getByRole('status')).toHaveTextContent('Loading Pokémon...')
    })
  })

  describe('error state', () => {
    it('shows the error message when the fetch fails', () => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: null,
        loading: false,
        error: 'Failed to load Pokémon.',
      })
      vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())

      render(<PokemonDetails />)

      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to load Pokémon.',
      )
    })

    it('shows "Pokémon not found." when pokemon is null and there is no error', () => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: null,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())

      render(<PokemonDetails />)

      expect(screen.getByRole('alert')).toHaveTextContent('Pokémon not found.')
    })
  })

  describe('pokemon details', () => {
    beforeEach(() => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: mockPokemon,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())
    })

    it('renders the pokemon name and formatted id', () => {
      render(<PokemonDetails />)

      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
      expect(screen.getByText('#0001')).toBeInTheDocument()
    })

    it('renders all type badges', () => {
      render(<PokemonDetails />)

      expect(screen.getByText(/grass/i)).toBeInTheDocument()
      expect(screen.getByText(/poison/i)).toBeInTheDocument()
    })

    it('renders formatted height and weight', () => {
      render(<PokemonDetails />)

      expect(screen.getByText('7 m')).toBeInTheDocument()
      expect(screen.getByText('69 kg')).toBeInTheDocument()
    })

    it('renders the pokemon image', () => {
      render(<PokemonDetails />)

      expect(screen.getByRole('img', { name: 'bulbasaur' })).toHaveAttribute(
        'src',
        'bulbasaur.png',
      )
    })

    it('renders all base stat labels', () => {
      render(<PokemonDetails />)

      expect(screen.getByText('HP')).toBeInTheDocument()
      expect(screen.getByText('Attack')).toBeInTheDocument()
      expect(screen.getByText('Defense')).toBeInTheDocument()
      expect(screen.getByText('Sp. Attack')).toBeInTheDocument()
      expect(screen.getByText('Sp. Defense')).toBeInTheDocument()
      expect(screen.getByText('Speed')).toBeInTheDocument()
    })

    it('renders the Catch button when pokemon is not caught', () => {
      render(<PokemonDetails />)

      expect(screen.getByRole('button', { name: 'Catch' })).toBeInTheDocument()
    })

    it('does not render the note form when pokemon is not caught', () => {
      render(<PokemonDetails />)

      expect(
        screen.queryByRole('textbox', { name: /note/i }),
      ).not.toBeInTheDocument()
    })
  })

  describe('caught pokemon', () => {
    beforeEach(() => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: mockPokemon,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(
        makePokedex({
          caught: new Map([[1, mockCaughtPokemon]]),
          isCaught: vi.fn().mockReturnValue(true),
        }),
      )
    })

    it('renders the Release button when pokemon is caught', () => {
      render(<PokemonDetails />)

      expect(
        screen.getByRole('button', { name: 'Release' }),
      ).toBeInTheDocument()
    })

    it('shows the caught date', () => {
      render(<PokemonDetails />)

      expect(screen.getByText(/caught on/i)).toBeInTheDocument()
    })

    it('renders the note form when pokemon is caught', () => {
      render(<PokemonDetails />)

      expect(screen.getByRole('textbox', { name: /note/i })).toBeInTheDocument()
    })

    it('prefills the note form with the existing note', () => {
      render(<PokemonDetails />)

      const textarea = screen.getByRole('textbox', {
        name: /note/i,
      }) as HTMLTextAreaElement
      expect(textarea.value).toBe('My note')
    })
  })

  describe('interactions', () => {
    it('calls navigate(-1) when the Back button is clicked', () => {
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: mockPokemon,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())

      render(<PokemonDetails />)

      fireEvent.click(screen.getByRole('button', { name: /back/i }))

      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it('calls pokedex.catch when the Catch button is clicked', () => {
      const mockPokedex = makePokedex()
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: mockPokemon,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(mockPokedex)

      render(<PokemonDetails />)

      fireEvent.click(screen.getByRole('button', { name: 'Catch' }))

      expect(mockPokedex.catch).toHaveBeenCalledWith({
        id: 1,
        name: 'bulbasaur',
      })
    })

    it('calls pokedex.release when the Release button is clicked', () => {
      const mockPokedex = makePokedex({
        caught: new Map([[1, mockCaughtPokemon]]),
        isCaught: vi.fn().mockReturnValue(true),
      })
      vi.mocked(usePokemon).mockReturnValueOnce({
        pokemon: mockPokemon,
        loading: false,
        error: null,
      })
      vi.mocked(usePokedex).mockReturnValueOnce(mockPokedex)

      render(<PokemonDetails />)

      fireEvent.click(screen.getByRole('button', { name: 'Release' }))

      expect(mockPokedex.release).toHaveBeenCalledWith(1)
    })

    describe('share button', () => {
      afterEach(() => vi.restoreAllMocks())

      it('calls sharePokemon with the pokemon id and formatted name', () => {
        const spy = vi
          .spyOn(shareUtils, 'sharePokemon')
          .mockResolvedValueOnce({ success: true, message: '' })
        vi.mocked(usePokemon).mockReturnValueOnce({
          pokemon: mockPokemon,
          loading: false,
          error: null,
        })
        vi.mocked(usePokedex).mockReturnValueOnce(makePokedex())

        render(<PokemonDetails />)

        fireEvent.click(screen.getByRole('button', { name: 'Share Bulbasaur' }))

        expect(spy).toHaveBeenCalledWith(1, 'Bulbasaur')
      })
    })
  })
})
