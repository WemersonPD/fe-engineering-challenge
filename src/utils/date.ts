export function toStartOfDay(date: string): string {
  return `${date}T00:00:00.000Z`
}

export function toEndOfDay(date: string): string {
  return `${date}T23:59:59.999Z`
}

export function toLocalDateString(date: Date | string): string {
  const formattedDate = new Date(date)

  const browserLocale = undefined
  return new Intl.DateTimeFormat(browserLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(formattedDate)
    .replace(', ', ' ')
}
