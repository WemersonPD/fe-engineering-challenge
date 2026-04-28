import { ElementType, ComponentPropsWithoutRef } from 'react'

const variantClasses = {
  sm: 'font-semibold text-xs leading-4',
  base: 'font-semibold text-sm leading-5',
  lg: 'font-semibold text-lg leading-7',
  inter: 'font-inter font-normal text-lg leading-none tracking-tight',
  'inter-light': 'font-inter font-normal text-sm leading-none tracking-tight',
} as const

type Variant = keyof typeof variantClasses

type TextProps<T extends ElementType = 'span'> = {
  tag?: T
  variant?: Variant
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'tag' | 'variant'>

export default function Text<T extends ElementType = 'span'>({
  tag,
  variant = 'base',
  className,
  children,
  ...rest
}: TextProps<T>) {
  const Tag = (tag ?? 'span') as ElementType
  return (
    <Tag
      className={[variantClasses[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  )
}
