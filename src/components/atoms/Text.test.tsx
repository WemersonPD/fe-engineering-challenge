import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Text from './Text'

describe('Text', () => {
  it('matches snapshot', () => {
    const { container } = render(<Text variant="base">Hello</Text>)
    expect(container).toMatchSnapshot()
  })

  it('renders children', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as span by default', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello').tagName).toBe('SPAN')
  })

  it('renders as a custom tag', () => {
    render(<Text tag="h1">Hello</Text>)
    expect(screen.getByText('Hello').tagName).toBe('H1')
  })

  it('applies variant class', () => {
    render(<Text variant="lg">Hello</Text>)
    expect(screen.getByText('Hello')).toHaveClass('text-lg')
  })
})
