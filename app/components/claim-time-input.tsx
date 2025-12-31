import type { ComponentProps } from 'react'

export function ClaimTimeInput(props: ComponentProps<'input'>) {
  return (
    <label className="floating-label">
      <input {...props} type="text" className="input font-medium" />
      <span>{props.placeholder}</span>
    </label>
  )
}
