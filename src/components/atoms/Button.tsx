import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

const variantClasses = {
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  red: 'bg-red-100 text-red-600 hover:bg-red-200',
  gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed',
} as const

type Variant = keyof typeof variantClasses

type ButtonProps = {
  variant?: Variant
} & ComponentPropsWithoutRef<'button'>

export default function Button({
  variant = 'green',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'py-1.5 px-4 rounded-xl text-sm font-medium transition-colors cursor-pointer',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
