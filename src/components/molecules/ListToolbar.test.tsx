import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ListToolbar from './ListToolbar'

const trigger = <button>Trigger</button>

describe('ListToolbar', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders the trigger', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })

  it('renders the more options button', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    expect(screen.getByLabelText('More options')).toBeInTheDocument()
  })

  it('does not show children by default', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    expect(screen.queryByText('Menu')).not.toBeInTheDocument()
  })

  it('shows children when more options button is clicked', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    fireEvent.click(screen.getByLabelText('More options'))
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })

  it('hides children when backdrop is clicked', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    fireEvent.click(screen.getByLabelText('More options'))
    expect(screen.getByText('Menu')).toBeInTheDocument()

    fireEvent.click(document.querySelector('[aria-hidden="true"]')!)
    expect(screen.queryByText('Menu')).not.toBeInTheDocument()
  })

  it('hides children when close is called from children', () => {
    render(
      <ListToolbar trigger={trigger}>
        {(close) => <button onClick={close}>Close Me</button>}
      </ListToolbar>,
    )
    fireEvent.click(screen.getByLabelText('More options'))
    expect(screen.getByText('Close Me')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close Me'))
    expect(screen.queryByText('Close Me')).not.toBeInTheDocument()
  })

  it('toggles children closed when more options button is clicked again', () => {
    render(<ListToolbar trigger={trigger}>{() => <div>Menu</div>}</ListToolbar>)
    const btn = screen.getByLabelText('More options')

    fireEvent.click(btn)
    expect(screen.getByText('Menu')).toBeInTheDocument()

    fireEvent.click(btn)
    expect(screen.queryByText('Menu')).not.toBeInTheDocument()
  })

  it('passes close function to children', () => {
    const children = vi.fn(() => <div>Menu</div>)
    render(<ListToolbar trigger={trigger}>{children}</ListToolbar>)
    fireEvent.click(screen.getByLabelText('More options'))
    expect(children).toHaveBeenCalledWith(expect.any(Function))
  })
})
