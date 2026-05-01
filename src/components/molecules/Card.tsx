import { useNavigate } from 'react-router-dom'
import type { CaughtPokemon, Pokemon } from '../../types/pokemon'
import Button from '../atoms/Button'
import Text from '../atoms/Text'
import Badge from '../atoms/Badge'
import {
  formatHeight,
  formatPokemonId,
  formatWeight,
} from '../../utils/pokemon'
import type { MouseEvent } from 'react'

const COLOR_GRADIENT: Record<string, string> = {
  black: 'from-gray-200',
  blue: 'from-blue-100',
  brown: 'from-amber-100',
  gray: 'from-gray-100',
  green: 'from-green-100',
  pink: 'from-pink-100',
  purple: 'from-purple-100',
  red: 'from-red-100',
  white: 'from-gray-50',
  yellow: 'from-yellow-100',
}

interface CardProps {
  pokemon: Pokemon
  caught?: CaughtPokemon
  onCatch: (pokemon: Pokemon) => void
  onRelease: (id: number) => void
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Card({
  pokemon,
  caught,
  onCatch,
  onRelease,
}: CardProps) {
  const navigate = useNavigate()
  const isCaught = !!caught
  const formattedName = capitalize(pokemon.name.replace(/-/g, ' '))
  const primaryType = pokemon.types[0]
  const gradientFrom = COLOR_GRADIENT[pokemon.color] ?? 'from-gray-50'

  const onActionCardClicked = (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation()

    if (isCaught) {
      onRelease(pokemon.id)
      return
    }

    onCatch(pokemon)
  }

  return (
    <article
      aria-label={`${formattedName}, ${pokemon.hp} HP, ${isCaught ? 'caught' : 'not caught'}`}
      className={`w-64 flex flex-col rounded-2xl bg-linear-to-b ${gradientFrom} to-white border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Text tag="p" variant="sm" className="text-gray-500 font-medium">
          {formatPokemonId(pokemon.id)}
        </Text>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {formattedName}
          </h3>

          <div className="flex items-center gap-1.5 shrink-0">
            <Text tag="span" variant="base" className="text-gray-800">
              <span className="sr-only">HP: </span>
              {pokemon.hp} HP
            </Text>
            <span
              aria-label={primaryType}
              className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold uppercase"
            >
              {primaryType.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="mx-3 border border-gray-200 rounded-sm bg-gray-50 flex items-center justify-center aspect-4/3">
        <img
          src={pokemon.image}
          alt={formattedName}
          loading="lazy"
          className="w-4/5 h-4/5 object-contain mix-blend-multiply"
        />
      </div>

      {/* Height / Weight banner */}
      <div className="mx-3 mt-3 bg-amber-400 py-1.5 px-3 text-center rounded-sm">
        <Text tag="p" variant="base" className="text-amber-900">
          <span className="sr-only">Height: </span>
          Length {formatHeight(pokemon.height)},{' '}
          <span className="sr-only">Weight: </span>
          Weight: {formatWeight(pokemon.weight)}
        </Text>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 text-center">
        <dl className="sr-only">
          <div>
            <dt>Speed</dt>
            <dd>{pokemon.speed}</dd>
          </div>
          <div>
            <dt>Attack</dt>
            <dd>{pokemon.attack}</dd>
          </div>
          <div>
            <dt>Defense</dt>
            <dd>{pokemon.defense}</dd>
          </div>
          <div>
            <dt>Special Attack</dt>
            <dd>{pokemon.specialAttack}</dd>
          </div>
          <div>
            <dt>Special Defense</dt>
            <dd>{pokemon.specialDefense}</dd>
          </div>
          <div>
            <dt>Types</dt>
            <dd>{pokemon.types.join(', ')}</dd>
          </div>
        </dl>
        <Text
          tag="p"
          aria-hidden="true"
          variant="base"
          className="text-gray-600 leading-snug font-normal"
        >
          Speed {pokemon.speed}, Attack {pokemon.attack}, Defense{' '}
          {pokemon.defense}, Special Attack {pokemon.specialAttack}, Special
          Defense {pokemon.specialDefense} —{' '}
          {pokemon.types.map(capitalize).join(', ')}
        </Text>
      </div>

      {/* Divider + types row */}
      <div className="border-t border-gray-200 mx-3" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <Badge key={t} type={t} />
          ))}
        </div>
        <Text tag="span" variant="base" className="text-gray-800">
          {pokemon.attack}
        </Text>
      </div>
      <div className="border-t border-gray-200 mx-3" />

      {/* Catch / Release */}
      <div className="px-3 py-3">
        <Button
          variant={isCaught ? 'red' : 'green'}
          onClick={(e) => onActionCardClicked(e)}
          aria-pressed={isCaught}
          className="w-full"
        >
          {isCaught ? 'Release' : 'Catch'}
        </Button>
      </div>
    </article>
  )
}
