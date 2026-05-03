export function formatPokemonName(name: string): string {
  const words = name.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

export function formatHeight(height: number): string {
  return `${height} m`
}

export function formatWeight(weight: number): string {
  return `${weight} kg`
}
