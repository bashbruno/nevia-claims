import type { ComponentProps, PropsWithChildren } from 'react'

type Props = PropsWithChildren<ComponentProps<'input'>>

export function AreaCheckbox({ children, ...props }: Props) {
  return (
    <label className="label text-sm p-2 rounded-md hover:bg-white/10 text-white">
      <input
        type="checkbox"
        className="checkbox checkbox-xs rounded-md checkbox-secondary"
        {...props}
      />
      {children}
    </label>
  )
}
