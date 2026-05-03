import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Table, { type Column } from '../../molecules/Table'
import Badge from '../../atoms/Badge'
import Button from '../../atoms/Button'
import ActionButton from '../../atoms/ActionButton'
import Checkbox from '../../atoms/Checkbox'
import {
  formatPokemonId,
  formatPokemonName,
  formatHeight,
  formatWeight,
} from '../../../utils/pokemon'
import { sharePokemon } from '../../../utils/share'
import { ShareIcon } from '@heroicons/react/24/outline'
import type { SortField } from '../../../types/filters'
import type { Pokemon } from '../../../types/pokemon'
import type { ViewProps } from './types'
import Text from '../../atoms/Text'
import { toLocalDateString } from '../../../utils/date'

export default function TableView({
  pokemon,
  caught,
  sort,
  onSortChange,
  onCatch,
  onRelease,
  selectedIds,
  onToggleSelect,
}: ViewProps) {
  const navigate = useNavigate()
  const isBulkMode = !!onToggleSelect

  const columns = useMemo<Column<Pokemon>[]>(() => {
    const selectColumn: Column<Pokemon> = {
      key: 'select',
      header: '',
      render: (row) => (
        <Checkbox
          id={`select-table-pokemon-${row.id}`}
          aria-label={`Select ${row.name} for bulk release`}
          checked={selectedIds.has(row.id)}
          onChange={() => onToggleSelect!(row.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    }

    return [
      ...(isBulkMode ? [selectColumn] : []),
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
            <Text className="text-gray-400 text-xs">
              {formatPokemonId(row.id)}
            </Text>
          </div>
        ),
      },
      {
        key: 'name',
        header: 'Name',
        sortKey: 'name',
        render: (row) => <Text>{formatPokemonName(row.name)}</Text>,
      },
      {
        key: 'height',
        header: 'Height',
        sortKey: 'height',
        render: (row) => formatHeight(row.height),
      },
      {
        key: 'weight',
        header: 'Weight',
        render: (row) => formatWeight(row.weight),
      },
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
          return entry ? toLocalDateString(entry.caughtAt) : '—'
        },
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => {
          const formattedName = formatPokemonName(row.name)
          return (
            <div className="flex items-center gap-2">
              {caught.has(row.id) ? (
                <Button
                  variant="red"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRelease(row.id)
                  }}
                >
                  Release
                </Button>
              ) : (
                <Button
                  variant="green"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCatch(row)
                  }}
                >
                  Catch
                </Button>
              )}

              <ActionButton
                aria-label={`Share ${formattedName}`}
                onClick={(e) => {
                  e.stopPropagation()
                  sharePokemon(row.id, formattedName)
                }}
                className="w-8 h-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <ShareIcon className="w-4 h-4" />
              </ActionButton>
            </div>
          )
        },
      },
    ]
  }, [isBulkMode, caught, selectedIds, onToggleSelect, onCatch, onRelease])

  const handleSort = (sortKey: string) => {
    const field = sortKey as SortField
    if (sort.field === field && sort.order === 'asc') {
      onSortChange({ field, order: 'desc' })
      return
    }

    onSortChange({ field, order: 'asc' })
  }

  const handleRowClick = (row: Pokemon) => {
    if (isBulkMode) {
      if (caught.has(row.id)) onToggleSelect(row.id)
      return
    }

    navigate(`/pokemon/${row.id}`)
  }

  return (
    <Table
      columns={columns}
      data={pokemon}
      sort={sort}
      onSort={handleSort}
      onRowClick={handleRowClick}
    />
  )
}
