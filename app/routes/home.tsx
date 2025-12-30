import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '~/components/app-layout'
import { getAreas, getReservations } from '~/lib/api/functions'
import { reservationsQueryOpts } from '~/lib/api/react-query'
import type { Route } from './+types/home'

export async function loader() {
  const [areas, reservations] = await Promise.all([
    getAreas(),
    getReservations(),
  ])

  return {
    areas,
    reservations,
  }
}

export function meta() {
  return [
    { title: 'Nevia Claims (Unofficial)' },
    { name: 'description', content: 'Claims for the Nevia Tibia server' },
  ]
}

export default function Home({
  loaderData: { areas, reservations: loaderReservations },
}: Route.ComponentProps) {
  // used to inject the initial data into the cache, we don't need the hook result here
  useQuery({
    ...reservationsQueryOpts,
    initialData: loaderReservations,
  })

  return <AppLayout areas={areas}>toma</AppLayout>
}
