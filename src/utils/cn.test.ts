import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters out undefined', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
  })

  it('filters out null', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar')
  })

  it('filters out false', () => {
    expect(cn('foo', false, 'bar')).toBe('foo bar')
  })

  it('returns empty string when all values are falsy', () => {
    expect(cn(undefined, null, false)).toBe('')
  })

  it('returns empty string with no arguments', () => {
    expect(cn()).toBe('')
  })

  it('handles a single class', () => {
    expect(cn('foo')).toBe('foo')
  })
})
