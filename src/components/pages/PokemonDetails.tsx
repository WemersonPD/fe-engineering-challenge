import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline'
import Badge from '../atoms/Badge'
import Button from '../atoms/Button'
import ActionButton from '../atoms/ActionButton'
import Text from '../atoms/Text'
import NoteForm from '../molecules/NoteForm'
import { usePokemon } from '../../hooks/usePokemon'
import { usePokedex } from '../../hooks/usePokedex'
import {
  formatPokemonId,
  formatHeight,
  formatWeight,
  formatPokemonName,
} from '../../utils/pokemon'
import { toLocalDateString } from '../../utils/date'
import { sharePokemon } from '../../utils/share'

const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Sp. Attack' },
  { key: 'specialDefense', label: 'Sp. Defense' },
  { key: 'speed', label: 'Speed' },
] as const

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

export default function PokemonDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pokemon, loading, error } = usePokemon(id)
  const pokedex = usePokedex()
  const caughtEntry = pokemon ? pokedex.caught.get(pokemon.id) : undefined
  const gradientFrom =
    COLOR_GRADIENT[pokemon?.color || 'gray'] ?? 'from-gray-50'
  const formattedName = formatPokemonName(pokemon?.name ?? '')

  if (loading)
    return (
      <Text
        tag="p"
        variant="inter-light"
        role="status"
        className="p-8 text-gray-500"
      >
        Loading Pokémon...
      </Text>
    )

  if (error || !pokemon)
    return (
      <Text
        tag="p"
        variant="inter-light"
        role="alert"
        className="p-8 text-red-600"
      >
        {error ?? 'Pokémon not found.'}
      </Text>
    )

  return (
    <div
      className={`min-h-screen bg-linear-to-b ${gradientFrom} to-white p-6 lg:p-10`}
    >
      <Button
        variant="gray"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back
      </Button>

      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-center bg-gray-50 py-8">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="w-48 h-48 object-contain"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Text
              tag="h1"
              variant="inter"
              className="text-2xl font-bold capitalize text-gray-900"
            >
              {pokemon.name}
            </Text>
            <Text variant="base" className="text-gray-400">
              {formatPokemonId(pokemon.id)}
            </Text>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <Badge key={type} type={type} />
              ))}
            </div>
          </div>

          {pokedex.isCaught(pokemon.id) && (
            <div className="mb-6">
              <Text variant="sm" className="text-gray-400">
                Caught on{' '}
                <Text variant="sm" className="text-gray-700">
                  {toLocalDateString(
                    new Date(pokedex.caught.get(pokemon.id)!.caughtAt),
                  )}
                </Text>
              </Text>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <Text variant="sm" className="text-gray-400 mb-0.5 block">
                Height
              </Text>
              <Text variant="base" className="text-gray-900">
                {formatHeight(pokemon.height)}
              </Text>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <Text variant="sm" className="text-gray-400 mb-0.5 block">
                Weight
              </Text>
              <Text variant="base" className="text-gray-900">
                {formatWeight(pokemon.weight)}
              </Text>
            </div>
          </div>

          <Text
            tag="h2"
            variant="sm"
            className="text-gray-500 uppercase tracking-wide mb-3 block"
          >
            Base Stats
          </Text>
          <div className="space-y-2">
            {STATS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <Text variant="sm" className="w-24 text-gray-400 shrink-0">
                  {label}
                </Text>
                <Text
                  variant="sm"
                  className="w-8 text-gray-900 text-right shrink-0"
                >
                  {pokemon[key]}
                </Text>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min((pokemon[key] / 255) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {pokedex.isCaught(pokemon.id) && (
            <NoteForm
              defaultValue={caughtEntry?.note}
              onSubmit={(note) => pokedex.updateNote(pokemon.id, note)}
            />
          )}
        </div>

        <div className="border-t border-gray-200 mx-3" />
        <div className="px-3 py-3 flex items-center gap-2">
          <Button
            variant={pokedex.isCaught(pokemon.id) ? 'red' : 'green'}
            onClick={() =>
              pokedex.isCaught(pokemon.id)
                ? pokedex.release(pokemon.id)
                : pokedex.catch({ id: pokemon.id, name: pokemon.name })
            }
            className="flex-1"
          >
            {pokedex.isCaught(pokemon.id) ? 'Release' : 'Catch'}
          </Button>

          <ActionButton
            aria-label={`Share ${formattedName}`}
            onClick={() => sharePokemon(pokemon.id, formattedName)}
            className="w-9 h-9 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ShareIcon className="w-5 h-5" />
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
