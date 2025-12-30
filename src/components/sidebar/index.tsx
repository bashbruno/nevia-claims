import type { AreasResponse } from '@/lib/api/types'

type Props = {
  areas: AreasResponse
}

export function Sidebar({ areas }: Props) {
  return <aside className="w-2xs"></aside>
}
