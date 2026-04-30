import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Table, { type Column } from './Table'

interface Row {
  id: number
  name: string
  hp: number
}

const columns: Column<Row>[] = [
  { key: 'id', header: '#' },
  { key: 'name', header: 'Name' },
  { key: 'hp', header: 'HP', sortKey: 'hp' },
]

const data: Row[] = [
  { id: 1, name: 'bulbasaur', hp: 45 },
  { id: 2, name: 'ivysaur', hp: 60 },
]

describe('Table', () => {
  it('matches snapshot', () => {
    const { container } = render(<Table columns={columns} data={data} />)
    expect(container).toMatchSnapshot()
  })

  it('renders column headers', () => {
    render(<Table columns={columns} data={data} />)
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('HP')).toBeInTheDocument()
  })

  it('renders a row for each data item', () => {
    render(<Table columns={columns} data={data} />)
    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('ivysaur')).toBeInTheDocument()
  })

  it('renders cell values using render prop when provided', () => {
    const customColumns: Column<Row>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (row) => <b>{row.name.toUpperCase()}</b>,
      },
    ]
    render(<Table columns={customColumns} data={data} />)
    expect(screen.getByText('BULBASAUR')).toBeInTheDocument()
    expect(screen.getByText('IVYSAUR')).toBeInTheDocument()
  })

  it('calls onSort with the column sortKey when a sortable header is clicked', () => {
    const onSort = vi.fn()
    render(<Table columns={columns} data={data} onSort={onSort} />)
    fireEvent.click(screen.getByText('HP'))
    expect(onSort).toHaveBeenCalledWith('hp')
  })

  it('does not call onSort when a non-sortable header is clicked', () => {
    const onSort = vi.fn()
    render(<Table columns={columns} data={data} onSort={onSort} />)
    fireEvent.click(screen.getByText('Name'))
    expect(onSort).not.toHaveBeenCalled()
  })

  it('shows asc sort icon on the active sorted column', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        sort={{ field: 'hp', order: 'asc' }}
        onSort={vi.fn()}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('shows desc sort icon on the active sorted column', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        sort={{ field: 'hp', order: 'desc' }}
        onSort={vi.fn()}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders nothing in tbody when data is empty', () => {
    render(<Table columns={columns} data={[]} />)
    const rows = screen.queryAllByRole('row')
    // only the header row
    expect(rows).toHaveLength(1)
  })
})
