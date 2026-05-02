import pokedexIcon from '../../assets/pokedex.svg'
import planetIcon from '../../assets/planet.webp'

type Props = {
  active: boolean
  onClick: () => void
}

export default function PokedexToggle({ active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? 'Show all Pokémon' : 'Show my Pokédex'}
      aria-pressed={active}
      className="fixed bottom-6 right-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg border
      border-gray-200 flex items-center justify-center hover:shadow-2xl transition-shadow cursor-pointer
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
    >
      <img
        src={active ? planetIcon : pokedexIcon}
        alt=""
        className="w-8 h-8 md:w-10 md:h-10"
        loading="lazy"
      />
    </button>
  )
}
