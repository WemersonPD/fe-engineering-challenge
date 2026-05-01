import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Link from './Link'

const renderLink = (to: string, className?: string) =>
  render(
    <MemoryRouter>
      <Link to={to} className={className}>
        Bulbasaur
      </Link>
    </MemoryRouter>,
  )

describe('Link', () => {
  it('matches snapshot', () => {
    const { container } = renderLink('/pokemon/1')
    expect(container).toMatchSnapshot()
  })

  it('renders children', () => {
    renderLink('/pokemon/1')
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
  })

  it('applies custom className alongside base styles', () => {
    renderLink('/pokemon/1', 'capitalize')
    const link = screen.getByText('Bulbasaur')
    expect(link).toHaveClass('capitalize')
    expect(link).toHaveClass('text-sky-600')
  })
})
