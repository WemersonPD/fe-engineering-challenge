import Button from '../atoms/Button'
import Checkbox from '../atoms/Checkbox'
import Input from '../atoms/Input'
import Text from '../atoms/Text'
import type { Filters } from '../../types/filters'
import { toEndOfDay, toLocalDateString, toStartOfDay } from '../../utils/date'

export type { Filters }

const TODAY = toLocalDateString(new Date())

const ALL_TYPES = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
]

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}

export default function FilterPanel({
  filters,
  onChange,
  onClear,
}: FilterPanelProps) {
  function toggleType(type: string) {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]
    onChange({ ...filters, types })
  }

  return (
    <form aria-label="Filters" className="flex flex-col gap-6 text-sm">
      <div className="flex items-center justify-between">
        <Text variant="base" className="text-gray-700">
          Filters
        </Text>
        <Button variant="gray" onClick={onClear} className="text-xs py-1 px-2">
          Clear all
        </Button>
      </div>

      <Input
        id="filter-name"
        label="Name"
        type="text"
        placeholder="Search..."
        value={filters.name}
        onChange={(e) => onChange({ ...filters, name: e.target.value })}
      />

      <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
        <legend>
          <Text variant="base" className="font-medium text-gray-600">
            Type
          </Text>
        </legend>
        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
          {ALL_TYPES.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={filters.types.includes(type)}
              onChange={() => toggleType(type)}
              className="capitalize"
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
        <legend>
          <Text variant="base" className="font-medium text-gray-600">
            Height (m)
          </Text>
        </legend>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="number"
            min={0}
            max={filters.maxHeight}
            value={filters.minHeight}
            onChange={(e) =>
              onChange({ ...filters, minHeight: Number(e.target.value) })
            }
            wrapperClassName="w-20"
          />
          <Text variant="base" className="text-gray-400">
            –
          </Text>
          <Input
            type="number"
            min={filters.minHeight}
            max={20}
            value={filters.maxHeight}
            onChange={(e) =>
              onChange({ ...filters, maxHeight: Number(e.target.value) })
            }
            wrapperClassName="w-20"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
        <legend>
          <Checkbox
            label="Caught only"
            checked={filters.caughtOnly}
            onChange={(e) =>
              onChange({ ...filters, caughtOnly: e.target.checked })
            }
            className="font-medium text-gray-600"
          />
        </legend>

        {filters.caughtOnly && (
          <div className="flex flex-col gap-2 pl-1 mt-2">
            <Input
              id="filter-caught-after"
              label="Caught after"
              type="date"
              max={TODAY}
              value={
                filters.caughtAfter
                  ? toLocalDateString(filters.caughtAfter)
                  : ''
              }
              onChange={(e) =>
                onChange({
                  ...filters,
                  caughtAfter: e.target.value
                    ? toStartOfDay(e.target.value)
                    : '',
                })
              }
            />
            <Input
              id="filter-caught-before"
              label="Caught before"
              type="date"
              max={TODAY}
              value={
                filters.caughtBefore
                  ? toLocalDateString(filters.caughtBefore)
                  : ''
              }
              onChange={(e) =>
                onChange({
                  ...filters,
                  caughtBefore: e.target.value
                    ? toEndOfDay(e.target.value)
                    : '',
                })
              }
            />
          </div>
        )}
      </fieldset>
    </form>
  )
}
