import { render, waitFor } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

describe('NoteForm', () => {
  it('renders with an empty textarea when no defaultValue is passed', () => {
    const { getByRole } = render(<NoteForm onSubmit={() => {}} />)

    const textarea = getByRole('textbox', {
      name: /note/i,
    }) as HTMLTextAreaElement

    expect(textarea.value).toBe('')
  })

  it('renders the form with default value', () => {
    const defaultValue = 'This is a note about the Pokémon.'

    const { getByRole } = render(
      <NoteForm defaultValue={defaultValue} onSubmit={() => {}} />,
    )

    const textarea = getByRole('textbox', {
      name: /note/i,
    }) as HTMLTextAreaElement
    expect(textarea).toBeInTheDocument()
    expect(textarea.value).toBe(defaultValue)
  })

  it('submits the note when the form is submitted', async () => {
    const user = userEvent.setup()

    const onSubmit = vi.fn()
    const { getByRole } = render(<NoteForm onSubmit={onSubmit} />)

    const textarea = getByRole('textbox', {
      name: /note/i,
    }) as HTMLTextAreaElement
    await user.click(textarea)
    await user.type(textarea, 'This is a note about the Pokémon.')

    const submitButton = getByRole('button', {
      name: /save note/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('This is a note about the Pokémon.')
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/saved!/i)
  })
})
