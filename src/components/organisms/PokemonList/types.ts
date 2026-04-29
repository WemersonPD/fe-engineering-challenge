import type { CaughtPokemon, Pokemon } from '../../../types/pokemon'
import type { Sort } from '../../../types/filters'

export interface ViewProps {
  pokemon: Pokemon[]
  caught: Map<number, CaughtPokemon>
  sort: Sort
  onSortChange: (sort: Sort) => void
  onCatch: (pokemon: Pokemon) => void
  onRelease: (id: number) => void
}
