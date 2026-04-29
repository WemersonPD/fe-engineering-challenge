import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Input
        id="name"
        label="Name"
        placeholder="Search..."
        value=""
        onChange={() => {}}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders the label linked to the input', () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('renders without a label', () => {
    render(<Input id="name" value="" onChange={() => {}} />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('calls onChange when the user types', async () => {
    const handleChange = vi.fn()
    render(<Input id="name" label="Name" onChange={handleChange} />)
    await userEvent.type(screen.getByLabelText('Name'), 'Pika')
    expect(handleChange).toHaveBeenCalled()
  })
})
