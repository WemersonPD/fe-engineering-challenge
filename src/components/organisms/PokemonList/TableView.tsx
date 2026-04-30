import Table, { type Column } from '../../molecules/Table'
import Badge from '../../atoms/Badge'
import Button from '../../atoms/Button'
import type { SortField } from '../../../types/filters'
import type { Pokemon } from '../../../types/pokemon'
import type { ViewProps } from './types'

export default function TableView({
  pokemon,
  caught,
  sort,
  onSortChange,
  onCatch,
  onRelease,
}: ViewProps) {
  const columns: Column<Pokemon>[] = [
    {
      key: 'id',
      header: '#',
      sortKey: 'id',
      render: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.image}
            alt={row.name}
            className="w-8 h-8 object-contain"
          />
          <span className="text-gray-400 text-xs">
            {String(row.id).padStart(4, '0')}
          </span>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortKey: 'name',
      render: (row) => (
        <span className="capitalize">{row.name.replace(/-/g, ' ')}</span>
      ),
    },
    { key: 'height', header: 'Height', sortKey: 'height' },
    { key: 'weight', header: 'Weight' },
    { key: 'hp', header: 'HP' },
    { key: 'speed', header: 'Speed' },
    { key: 'attack', header: 'Attack' },
    { key: 'defense', header: 'Defense' },
    { key: 'specialAttack', header: 'Sp. Atk' },
    { key: 'specialDefense', header: 'Sp. Def' },
    {
      key: 'types',
      header: 'Types',
      sortKey: 'types',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.types.map((t) => (
            <Badge key={t} type={t} />
          ))}
        </div>
      ),
    },
    {
      key: 'caughtAt',
      header: 'Added to Pokédex',
      sortKey: 'timestamp',
      render: (row) => {
        const entry = caught.get(row.id)
        return entry ? new Date(entry.caughtAt).toLocaleDateString() : '—'
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => {
        if (caught.has(row.id)) {
          return (
            <Button variant="red" onClick={() => onRelease(row.id)}>
              Release
            </Button>
          )
        }
        return (
          <Button variant="green" onClick={() => onCatch(row)}>
            Catch
          </Button>
        )
      },
    },
  ]

  const handleSort = (sortKey: string) => {
    const field = sortKey as SortField
    if (sort.field === field && sort.order === 'asc') {
      onSortChange({ field, order: 'desc' })
      return
    }
    onSortChange({ field, order: 'asc' })
  }

  return (
    <Table columns={columns} data={pokemon} sort={sort} onSort={handleSort} />
  )
}
