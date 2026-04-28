import Pokedex from 'pokedex-promise-v2'
import type { Pokemon } from '../types/pokemon'

const P = new Pokedex()

const GEN1_COUNT = 151

function stat(stats: Pokedex.StatElement[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0
}

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const [pokemon, species] = await Promise.all([
    P.getPokemonByName(nameOrId as string),
    P.getPokemonSpeciesByName(nameOrId as string),
  ])

  return {
    id: pokemon.id,
    name: pokemon.name,
    color: species.color.name,
    image:
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default ??
      '',
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    hp: stat(pokemon.stats, 'hp'),
    attack: stat(pokemon.stats, 'attack'),
    defense: stat(pokemon.stats, 'defense'),
    specialAttack: stat(pokemon.stats, 'special-attack'),
    specialDefense: stat(pokemon.stats, 'special-defense'),
    speed: stat(pokemon.stats, 'speed'),
    types: pokemon.types.map((t) => t.type.name),
  }
}

export async function fetchGen1(): Promise<Pokemon[]> {
  const ids = Array.from({ length: GEN1_COUNT }, (_, i) => String(i + 1))

  const BATCH_SIZE = 20
  const results: Pokemon[] = []

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE)
    const [pokemonList, speciesList] = await Promise.all([
      P.getPokemonByName(batch) as Promise<Pokedex.Pokemon[]>,
      P.getPokemonSpeciesByName(batch) as Promise<Pokedex.PokemonSpecies[]>,
    ])

    for (let j = 0; j < pokemonList.length; j++) {
      const pokemon = pokemonList[j]
      const species = speciesList[j]
      results.push({
        id: pokemon.id,
        name: pokemon.name,
        color: species.color.name,
        image:
          pokemon.sprites.other?.['official-artwork']?.front_default ??
          pokemon.sprites.front_default ??
          '',
        height: pokemon.height / 10,
        weight: pokemon.weight / 10,
        hp: stat(pokemon.stats, 'hp'),
        attack: stat(pokemon.stats, 'attack'),
        defense: stat(pokemon.stats, 'defense'),
        specialAttack: stat(pokemon.stats, 'special-attack'),
        specialDefense: stat(pokemon.stats, 'special-defense'),
        speed: stat(pokemon.stats, 'speed'),
        types: pokemon.types.map((t) => t.type.name),
      })
    }
  }

  return results.sort((a, b) => a.id - b.id)
}
