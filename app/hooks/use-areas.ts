import { useAppContext } from '~/components/app-layout'

export function useAreas() {
  const { areas } = useAppContext()
  return areas
}
