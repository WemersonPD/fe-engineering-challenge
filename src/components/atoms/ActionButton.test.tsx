import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ActionButton from './ActionButton'

describe('ActionButton', () => {
  it('matches snapshot', () => {
    const { container } = render(<ActionButton aria-label="Share" />)
    expect(container).toMatchSnapshot()
  })

  it('renders children', () => {
    render(<ActionButton>Share</ActionButton>)
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<ActionButton onClick={onClick}>Share</ActionButton>)
    fireEvent.click(screen.getByText('Share'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <ActionButton onClick={onClick} disabled>
        Share
      </ActionButton>,
    )
    fireEvent.click(screen.getByText('Share'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies additional className', () => {
    render(<ActionButton className="text-gray-500">Share</ActionButton>)
    expect(screen.getByText('Share')).toHaveClass('text-gray-500')
  })

  it('forwards extra props to the button element', () => {
    render(<ActionButton aria-label="Share Bulbasaur">Share</ActionButton>)
    expect(screen.getByRole('button', { name: 'Share Bulbasaur' })).toBeInTheDocument()
  })
})
