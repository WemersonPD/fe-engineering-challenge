import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateUniqueCode } from './code'

describe('generateUniqueCode', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a string of the default length (8)', () => {
    const codeGenerated = generateUniqueCode()

    expect(codeGenerated).toHaveLength(8)
  })

  it('returns a string no longer than the specified size', () => {
    expect(generateUniqueCode(4).length).toBeLessThanOrEqual(4)
    expect(generateUniqueCode(8).length).toBeLessThanOrEqual(8)
  })

  it('returns different values on successive calls', () => {
    const a = generateUniqueCode()
    const b = generateUniqueCode()
    expect(a).not.toBe(b)
  })
})
