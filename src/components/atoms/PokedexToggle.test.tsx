import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PokedexToggle from './PokedexToggle'

describe('PokedexToggle', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <PokedexToggle active={false} onClick={vi.fn()} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<PokedexToggle active={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
