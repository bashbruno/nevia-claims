import { Checkbox, type CheckboxProps } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'

export function AreaCheckbox({ children, ...props }: CheckboxProps) {
  return (
    <Label>
      <Checkbox {...props} />
      {children}
    </Label>
  )
}
