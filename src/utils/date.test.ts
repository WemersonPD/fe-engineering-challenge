import { toStartOfDay, toEndOfDay, toLocalDateString } from './date'

describe('toStartOfDay', () => {
  it('appends midnight UTC time to a date string', () => {
    expect(toStartOfDay('2024-03-15')).toBe('2024-03-15T00:00:00.000Z')
  })
})

describe('toEndOfDay', () => {
  it('appends end-of-day UTC time to a date string', () => {
    expect(toEndOfDay('2024-03-15')).toBe('2024-03-15T23:59:59.999Z')
  })
})

describe('toLocalDateString', () => {
  it('formats a Date object as YYYY-MM-DD', () => {
    expect(toLocalDateString(new Date(2024, 2, 15))).toBe('2024-03-15')
  })

  it('pads single-digit month and day with a leading zero', () => {
    expect(toLocalDateString(new Date(2024, 0, 5))).toBe('2024-01-05')
  })

  it('accepts an ISO string and returns the local date', () => {
    const iso = new Date(2024, 5, 20).toISOString()
    expect(toLocalDateString(iso)).toBe('2024-06-20')
  })

  it('handles year boundaries correctly', () => {
    expect(toLocalDateString(new Date(2024, 11, 31))).toBe('2024-12-31')
  })
})
