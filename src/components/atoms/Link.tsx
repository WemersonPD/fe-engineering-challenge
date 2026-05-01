import { Link as RouterLink, type LinkProps } from 'react-router-dom'
import { cn } from '../../utils/cn'

export default function Link({ className, children, ...rest }: LinkProps) {
  return (
    <RouterLink
      className={cn(
        'text-sky-600 hover:text-red-600 hover:underline transition-colors',
        className,
      )}
      {...rest}
    >
      {children}
    </RouterLink>
  )
}
