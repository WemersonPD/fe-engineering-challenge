import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

type InputProps = {
  label?: string
  wrapperClassName?: string
} & ComponentPropsWithoutRef<'input'>

export default function Input({ label, id, className, wrapperClassName, ...rest }: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300',
          className,
        )}
        {...rest}
      />
    </div>
  )
}
