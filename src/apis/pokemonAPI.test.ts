import { describe, it, expect, vi, beforeEach } from 'vitest'
import type Pokedex from 'pokedex-promise-v2'
import { fetchPokemon, fetchGen1 } from './pokemonAPI'

const mockGetPokemonByName = vi.hoisted(() => vi.fn())
const mockGetPokemonSpeciesByName = vi.hoisted(() => vi.fn())

vi.mock('pokedex-promise-v2', () => {
  class MockPokedex {
    getPokemonByName = mockGetPokemonByName
    getPokemonSpeciesByName = mockGetPokemonSpeciesByName
  }
  return { default: MockPokedex }
})

function makePokemonResponse(
  overrides: Partial<Pokedex.Pokemon> = {},
): Pokedex.Pokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: {
      front_default: 'https://example.com/front.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/official.png',
          front_shiny: null,
        },
      },
    },
    stats: [
      { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 49, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 65, effort: 1, stat: { name: 'special-attack', url: '' } },
      { base_stat: 65, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 45, effort: 0, stat: { name: 'speed', url: '' } },
    ],
    types: [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } },
    ],
    ...overrides,
  } as unknown as Pokedex.Pokemon
}

function makeSpeciesResponse(
  overrides: Partial<Pokedex.PokemonSpecies> = {},
): Pokedex.PokemonSpecies {
  return {
    color: { name: 'green', url: '' },
    ...overrides,
  } as unknown as Pokedex.PokemonSpecies
}

describe('pokemonAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchPokemon', () => {
    it('maps pokemon and species data to the Pokemon type', async () => {
      mockGetPokemonByName.mockResolvedValueOnce(makePokemonResponse())
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      const result = await fetchPokemon('bulbasaur')

      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        color: 'green',
        image: 'https://example.com/official.png',
        height: 0.7,
        weight: 6.9,
        hp: 45,
        attack: 49,
        defense: 49,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
        types: ['grass', 'poison'],
      })
    })

    it('falls back to empty string when all sprite sources are missing', async () => {
      mockGetPokemonByName.mockResolvedValueOnce(
        makePokemonResponse({
          sprites: {
            front_default: null,
            other: {},
          } as unknown as Pokedex.Pokemon['sprites'],
        }),
      )
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      const result = await fetchPokemon('bulbasaur')
      expect(result.image).toBe('')
    })

    it('falls back to front_default sprite when official artwork is missing', async () => {
      const pokemon = makePokemonResponse({
        sprites: {
          front_default: 'https://example.com/front.png',
          other: {},
        } as Pokedex.Pokemon['sprites'],
      })
      mockGetPokemonByName.mockResolvedValueOnce(pokemon)
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      const result = await fetchPokemon('bulbasaur')

      expect(result.image).toBe('https://example.com/front.png')
    })

    it('converts height and weight from decimetres/hectograms to metres/kilograms', async () => {
      const pokemon = makePokemonResponse({ height: 20, weight: 905 })
      mockGetPokemonByName.mockResolvedValueOnce(pokemon)
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      const result = await fetchPokemon('snorlax')

      expect(result.height).toBe(2)
      expect(result.weight).toBe(90.5)
    })

    it('defaults missing stats to 0', async () => {
      const pokemon = makePokemonResponse({ stats: [] })
      mockGetPokemonByName.mockResolvedValueOnce(pokemon)
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      const result = await fetchPokemon('bulbasaur')

      expect(result.hp).toBe(0)
      expect(result.attack).toBe(0)
      expect(result.defense).toBe(0)
      expect(result.specialAttack).toBe(0)
      expect(result.specialDefense).toBe(0)
      expect(result.speed).toBe(0)
    })

    it('calls both APIs with the given identifier', async () => {
      mockGetPokemonByName.mockResolvedValueOnce(makePokemonResponse())
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      await fetchPokemon('1')

      expect(mockGetPokemonByName).toHaveBeenCalledWith('1')
      expect(mockGetPokemonSpeciesByName).toHaveBeenCalledWith('1')
    })

    it('throws when the API call fails', async () => {
      mockGetPokemonByName.mockRejectedValueOnce(new Error('Not found'))
      mockGetPokemonSpeciesByName.mockResolvedValueOnce(makeSpeciesResponse())

      await expect(fetchPokemon('9999')).rejects.toThrow('Not found')
    })
  })

  describe('fetchGen1', () => {
    function makeBatch(startId: number, size: number) {
      const pokemonList = Array.from({ length: size }, (_, i) =>
        makePokemonResponse({
          id: startId + i,
          name: `pokemon-${startId + i}`,
        }),
      )
      const speciesList = Array.from({ length: size }, () =>
        makeSpeciesResponse(),
      )
      return { pokemonList, speciesList }
    }

    function setupBatchMocks() {
      const BATCH_SIZE = 20
      const GEN1_COUNT = 151

      for (let i = 0; i < GEN1_COUNT; i += BATCH_SIZE) {
        const size = Math.min(BATCH_SIZE, GEN1_COUNT - i)
        const { pokemonList, speciesList } = makeBatch(i + 1, size)
        mockGetPokemonByName.mockResolvedValueOnce(pokemonList)
        mockGetPokemonSpeciesByName.mockResolvedValueOnce(speciesList)
      }
    }

    it('returns 151 pokemon sorted by id', async () => {
      setupBatchMocks()

      const result = await fetchGen1()

      expect(result).toHaveLength(151)
      expect(result[0].id).toBe(1)
      expect(result[150].id).toBe(151)
      expect(result.map((p) => p.id)).toEqual(
        Array.from({ length: 151 }, (_, i) => i + 1),
      )
    })

    it('fetches in batches of 20', async () => {
      setupBatchMocks()

      await fetchGen1()

      const expectedBatches = Math.ceil(151 / 20)
      expect(mockGetPokemonByName).toHaveBeenCalledTimes(expectedBatches)
      expect(mockGetPokemonSpeciesByName).toHaveBeenCalledTimes(expectedBatches)
    })

    it('throws when a batch fetch fails', async () => {
      mockGetPokemonByName.mockRejectedValueOnce(new Error('API error'))
      mockGetPokemonSpeciesByName.mockResolvedValueOnce([makeSpeciesResponse()])

      await expect(fetchGen1()).rejects.toThrow('API error')
    })
  })
})
