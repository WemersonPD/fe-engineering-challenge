import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('matches snapshot', () => {
    const { container } = render(<Button variant="green">Catch</Button>)
    expect(container).toMatchSnapshot()
  })

  it('renders children', () => {
    render(<Button>Catch</Button>)
    expect(screen.getByText('Catch')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Catch</Button>)
    fireEvent.click(screen.getByText('Catch'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Catch
      </Button>,
    )
    fireEvent.click(screen.getByText('Catch'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
