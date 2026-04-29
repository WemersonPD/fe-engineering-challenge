import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from './Badge'

const KNOWN_TYPES: [string, string, string][] = [
  ['bug', 'bg-lime-100', 'text-lime-700'],
  ['dark', 'bg-gray-800', 'text-gray-100'],
  ['dragon', 'bg-indigo-100', 'text-indigo-700'],
  ['electric', 'bg-yellow-100', 'text-yellow-700'],
  ['fairy', 'bg-pink-100', 'text-pink-600'],
  ['fighting', 'bg-orange-100', 'text-orange-700'],
  ['fire', 'bg-red-100', 'text-red-600'],
  ['flying', 'bg-sky-100', 'text-sky-600'],
  ['ghost', 'bg-purple-100', 'text-purple-700'],
  ['grass', 'bg-green-100', 'text-green-700'],
  ['ground', 'bg-amber-100', 'text-amber-700'],
  ['ice', 'bg-cyan-100', 'text-cyan-600'],
  ['normal', 'bg-gray-100', 'text-gray-600'],
  ['poison', 'bg-violet-100', 'text-violet-700'],
  ['psychic', 'bg-rose-100', 'text-rose-600'],
  ['rock', 'bg-stone-100', 'text-stone-600'],
  ['steel', 'bg-slate-100', 'text-slate-600'],
  ['water', 'bg-blue-100', 'text-blue-600'],
]

const UNKNOWN_TYPES = ['unknown', 'cosmic', 'shadow', '']

describe('Badge', () => {
  it('matches snapshot', () => {
    const { container } = render(<Badge type="fire" />)
    expect(container).toMatchSnapshot()
  })

  it('renders the type text', () => {
    render(<Badge type="water" />)
    expect(screen.getByText('water')).toBeInTheDocument()
  })

  it('is case-insensitive when matching type to color class', () => {
    const { container } = render(<Badge type="FIRE" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('bg-red-100')
  })

  it('merges a custom className', () => {
    const { container } = render(<Badge type="grass" className="extra-class" />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('extra-class')
  })

  it.each(KNOWN_TYPES)(
    'applies correct classes for type "%s"',
    (type, bgClass, textClass) => {
      const { container } = render(<Badge type={type} />)
      const span = container.querySelector('span')
      expect(span?.className).toContain(bgClass)
      expect(span?.className).toContain(textClass)
    },
  )

  it.each(UNKNOWN_TYPES)(
    'falls back to gray classes for unknown type "%s"',
    (type) => {
      const { container } = render(<Badge type={type} />)
      const span = container.querySelector('span')
      expect(span?.className).toContain('bg-gray-100')
      expect(span?.className).toContain('text-gray-600')
    },
  )
})
