import { useId, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  label?: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  wrapperClassName?: string
  'aria-label'?: string
} & Omit<ComponentPropsWithoutRef<'select'>, 'onChange' | 'value'>

export default function Dropdown({
  label,
  id,
  options,
  value,
  onChange,
  className,
  wrapperClassName,
  'aria-label': ariaLabel,
  ...rest
}: DropdownProps) {
  const generatedId = useId()
  const selectId = id ?? (label ? generatedId : undefined)

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={!label ? ariaLabel : undefined}
        className={cn(
          'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
          className,
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
