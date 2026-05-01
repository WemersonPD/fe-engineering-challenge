import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

type TextareaProps = {
  label?: string
  wrapperClassName?: string
} & ComponentPropsWithoutRef<'textarea'>

export default function Textarea({
  label,
  id,
  className,
  wrapperClassName,
  ...rest
}: TextareaProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
          className,
        )}
        {...rest}
      />
    </div>
  )
}
