import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ViewToggle from './ViewToggle'

const options = [
  { value: 'grid', label: 'Grid view', icon: <span>grid-icon</span> },
  { value: 'table', label: 'Table view', icon: <span>table-icon</span> },
]

describe('ViewToggle', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ViewToggle value="grid" onChange={vi.fn()} options={options} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders all options', () => {
    render(<ViewToggle value="grid" onChange={vi.fn()} options={options} />)
    expect(screen.getByLabelText('Grid view')).toBeInTheDocument()
    expect(screen.getByLabelText('Table view')).toBeInTheDocument()
  })

  it('marks the active option as pressed', () => {
    render(<ViewToggle value="table" onChange={vi.fn()} options={options} />)
    expect(screen.getByLabelText('Table view')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByLabelText('Grid view')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the selected value', () => {
    const onChange = vi.fn()
    render(<ViewToggle value="grid" onChange={onChange} options={options} />)
    fireEvent.click(screen.getByLabelText('Table view'))
    expect(onChange).toHaveBeenCalledWith('table')
  })
})
