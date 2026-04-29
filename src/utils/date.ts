export function toStartOfDay(date: string): string {
  return `${date}T00:00:00.000Z`
}

export function toEndOfDay(date: string): string {
  return `${date}T23:59:59.999Z`
}

export function toLocalDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
