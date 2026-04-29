import { cn } from '../../utils/cn'

const TYPE_CLASSES: Record<string, string> = {
  bug: 'bg-lime-100 text-lime-700',
  dark: 'bg-gray-800 text-gray-100',
  dragon: 'bg-indigo-100 text-indigo-700',
  electric: 'bg-yellow-100 text-yellow-700',
  fairy: 'bg-pink-100 text-pink-600',
  fighting: 'bg-orange-100 text-orange-700',
  fire: 'bg-red-100 text-red-600',
  flying: 'bg-sky-100 text-sky-600',
  ghost: 'bg-purple-100 text-purple-700',
  grass: 'bg-green-100 text-green-700',
  ground: 'bg-amber-100 text-amber-700',
  ice: 'bg-cyan-100 text-cyan-600',
  normal: 'bg-gray-100 text-gray-600',
  poison: 'bg-violet-100 text-violet-700',
  psychic: 'bg-rose-100 text-rose-600',
  rock: 'bg-stone-100 text-stone-600',
  steel: 'bg-slate-100 text-slate-600',
  water: 'bg-blue-100 text-blue-600',
}

interface BadgeProps {
  type: string
  className?: string
}

export default function Badge({ type, className }: BadgeProps) {
  const colorClass =
    TYPE_CLASSES[type.toLowerCase()] ?? 'bg-gray-100 text-gray-600'

  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
        colorClass,
        className,
      )}
    >
      {type}
    </span>
  )
}
