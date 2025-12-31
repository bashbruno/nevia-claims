import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'input'>>

export function AreaCheckbox({ children, ...props }: Props) {
  return (
    <label className="label text-sm p-2 rounded-md hover:bg-accent/10 text-white">
      <input
        type="checkbox"
        className="checkbox checkbox-xs checkbox-accent"
        {...props}
      />
      {children}
    </label>
  )
}
