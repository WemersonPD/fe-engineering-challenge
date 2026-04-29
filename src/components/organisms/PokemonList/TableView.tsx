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
      render: (_, row) => (
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
      render: (v) => (
        <span className="capitalize">{String(v).replace(/-/g, ' ')}</span>
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
      render: (v) => (
        <div className="flex flex-wrap gap-1">
          {(v as string[]).map((t) => (
            <Badge key={t} type={t} />
          ))}
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Added to Pokédex',
      sortKey: 'timestamp',
      render: (_, row) => {
        const entry = caught.get(row.id)
        return entry ? new Date(entry.caughtAt).toLocaleDateString() : '—'
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => {
        const isCaught = caught.has(row.id)
        return isCaught ? (
          <Button variant="red" onClick={() => onRelease(row.id)}>
            Release
          </Button>
        ) : (
          <Button variant="green" onClick={() => onCatch(row)}>
            Catch
          </Button>
        )
      },
    },
  ]

  const handleSort = (sortKey: string) => {
    const field = sortKey as SortField
    const order = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc'
    onSortChange({ field, order })
  }

  return (
    <Table columns={columns} data={pokemon} sort={sort} onSort={handleSort} />
  )
}
