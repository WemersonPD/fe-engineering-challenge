import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from './Dropdown'

const options = [
  { value: 'fire', label: 'Fire' },
  { value: 'water', label: 'Water' },
  { value: 'grass', label: 'Grass' },
]

describe('Dropdown', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Dropdown options={options} value="fire" onChange={vi.fn()} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders all options', () => {
    render(<Dropdown options={options} value="fire" onChange={vi.fn()} />)
    expect(screen.getByRole('option', { name: 'Fire' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Water' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Grass' })).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(
      <Dropdown
        label="Type"
        id="type"
        options={options}
        value="fire"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('does not render label when omitted', () => {
    render(<Dropdown options={options} value="fire" onChange={vi.fn()} />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('calls onChange with selected value', () => {
    const onChange = vi.fn()
    render(<Dropdown options={options} value="fire" onChange={onChange} />)
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'water' },
    })
    expect(onChange).toHaveBeenCalledWith('water')
  })

  it('reflects the current value', () => {
    render(<Dropdown options={options} value="grass" onChange={vi.fn()} />)
    expect(screen.getByRole('combobox')).toHaveValue('grass')
  })
})
