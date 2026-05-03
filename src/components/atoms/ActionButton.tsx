import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

type ActionButtonProps = ComponentPropsWithoutRef<'button'>

export default function ActionButton({ className, children, ...rest }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center rounded-full aspect-square cursor-pointer transition-colors',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
