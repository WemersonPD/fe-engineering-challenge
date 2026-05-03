import { describe, it, expect, vi, afterEach } from 'vitest'
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
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const stubFormat = (returnValue: string) => {
    const mockFormat = vi.fn().mockReturnValue(returnValue)
    vi.stubGlobal('Intl', {
      ...Intl,
      DateTimeFormat: vi.fn(function () {
        return { format: mockFormat }
      }),
    })
    return mockFormat
  }

  it('accepts a string date', () => {
    stubFormat('05/03/2026 09:04')

    expect(toLocalDateString('2026-05-03T09:04:00.000Z')).toBe('05/03/2026 09:04')
  })

  it('accepts a Date object', () => {
    stubFormat('05/03/2026 09:04')

    expect(toLocalDateString(new Date('2026-05-03T09:04:00.000Z'))).toBe('05/03/2026 09:04')
  })

  it('replaces ", " with " " in the formatted output', () => {
    stubFormat('05/03/2026, 09:04')

    expect(toLocalDateString('2026-05-03T09:04:00.000Z')).toBe('05/03/2026 09:04')
  })

  it('does not contain ", " in the output', () => {
    expect(toLocalDateString('2026-05-03T09:04:00.000Z')).not.toContain(', ')
  })
})
