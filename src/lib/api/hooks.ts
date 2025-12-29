import { useQuery } from '@tanstack/react-query'
import { getAreas, getReservations } from '@/lib/api/functions'

export const queryKeys = {
  areas: ['areas'],
  reservations: ['reservations'],
} as const

export function useAreas() {
  return useQuery({
    queryKey: queryKeys.areas,
    queryFn: getAreas,
  })
}

export function useReservations() {
  return useQuery({
    queryKey: queryKeys.reservations,
    queryFn: getReservations,
  })
}
