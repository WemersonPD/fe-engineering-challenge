import Table, { type Column } from '../../molecules/Table'
import Badge from '../../atoms/Badge'
import type { Pokemon } from '../../../types/pokemon'
import type { ViewProps } from './types'

const COLUMNS: Column<Pokemon>[] = [
  {
    key: 'id',
    header: '#',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <img src={row.image} alt={row.name} className="w-8 h-8 object-contain" />
        <span className="text-gray-400 text-xs">
          {String(row.id).padStart(4, '0')}
        </span>
      </div>
    ),
  },
  {
    key: 'name',
    header: 'Name',
    render: (v) => (
      <span className="capitalize">{String(v).replace(/-/g, ' ')}</span>
    ),
  },
  { key: 'height', header: 'Height' },
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
    render: (v) => (
      <div className="flex flex-wrap gap-1">
        {(v as string[]).map((t) => <Badge key={t} type={t} />)}
      </div>
    ),
  },
]

export default function TableView({ pokemon, caught }: ViewProps) {
  const columns: Column<Pokemon>[] = [
    ...COLUMNS,
    {
      key: 'image',
      header: 'Added to Pokédex',
      render: (_, row) => {
        const entry = caught.get(row.id)
        return entry ? new Date(entry.caughtAt).toLocaleDateString() : '—'
      },
    },
  ]

  return <Table columns={columns} data={pokemon} />
}
