export interface Pokemon {
  id: number
  name: string
  color: string
  image: string
  height: number
  weight: number
  hp: number
  speed: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  types: string[]
}

export interface CaughtPokemon {
  id: number
  name: string
  caughtAt: string
  note: string
}
