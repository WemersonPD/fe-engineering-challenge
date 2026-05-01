import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Textarea from './Textarea'

describe('Textarea', () => {
  it('matches snapshot', () => {
    const { container } = render(<Textarea label="Note" id="note" />)
    expect(container).toMatchSnapshot()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Note" id="note" />)
    expect(screen.getByText('Note')).toBeInTheDocument()
  })

  it('does not render label when omitted', () => {
    render(<Textarea id="note" />)
    expect(screen.queryByText('Note')).not.toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'hello' },
    })
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('reflects typed value', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Note" id="note" />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    await user.type(textarea, 'my note')

    expect(textarea.value).toBe('my note')
  })
})
