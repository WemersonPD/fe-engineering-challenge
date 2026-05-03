import pokeballIcon from '../../assets/pokeball.svg'

interface PokemonImageProps {
  src: string
  alt: string
  isCaught?: boolean
  size?: 'sm' | 'lg'
}

export default function PokemonImage({
  src,
  alt,
  isCaught = false,
  size = 'sm',
}: PokemonImageProps) {
  const isLarge = size === 'lg'

  return (
    <div
      className={`relative flex justify-center bg-gray-50 ${
        isLarge
          ? 'py-8'
          : 'mx-3 border border-gray-200 rounded-sm items-center aspect-4/3'
      }`}
    >
      {isCaught && (
        <img
          src={pokeballIcon}
          alt="Caught"
          title="Caught"
          loading="lazy"
          className={`absolute ${isLarge ? 'top-3 right-3 w-8 h-8' : 'top-1.5 right-1.5 w-6 h-6'}`}
        />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={
          isLarge
            ? 'w-48 h-48 object-contain'
            : 'w-4/5 h-4/5 max-w-32 max-h-32 object-contain mix-blend-multiply'
        }
      />
    </div>
  )
}
