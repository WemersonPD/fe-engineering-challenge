import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from './Checkbox'

describe('Checkbox', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Checkbox id="fire" label="fire" checked={false} onChange={() => {}} />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders the label text', () => {
    render(<Checkbox id="fire" label="fire" checked={false} onChange={() => {}} />)
    expect(screen.getByText('fire')).toBeInTheDocument()
  })

  it('renders without a label', () => {
    render(<Checkbox id="fire" checked={false} onChange={() => {}} />)
    expect(screen.queryByText('fire')).not.toBeInTheDocument()
  })

  it('reflects the checked state', () => {
    render(<Checkbox id="fire" label="fire" checked={true} onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn()
    render(<Checkbox id="fire" label="fire" checked={false} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalled()
  })
})
