import type { ComponentProps } from 'react'
import { cn } from '~/utils'

type Props = {
  label: string
} & ComponentProps<'input'>

export function SearchInput({ label, className, ...props }: Props) {
  return (
    <label className="floating-label">
      <input
        type="search"
        className={cn(
          'input md:input-lg font-medium w-full lg:max-w-1/2',
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
