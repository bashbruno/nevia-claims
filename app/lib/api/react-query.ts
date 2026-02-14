import { queryOptions, useQuery } from '@tanstack/react-query'
import { getApiReservations } from '~/lib/api/functions'
import { time } from '~/utils'

const appQueryKeys = {
  reservations: ['reservations'] as const,
}

export const reservationsQueryOpts = queryOptions({
  queryKey: appQueryKeys.reservations,
  queryFn: getApiReservations,
  refetchInterval: time.second * 30,
  staleTime: time.second * 30,
  refetchOnWindowFocus: 'always',
})

export function useReservations() {
  return useQuery(reservationsQueryOpts)
}
