import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

type CheckboxProps = {
  label?: string
  className?: string
} & Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type'>

export default function Checkbox({ label, id, className, ...rest }: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <input
        id={id}
        type="checkbox"
        className="accent-gray-600"
        {...rest}
      />
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </label>
  )
}
