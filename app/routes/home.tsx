import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { AppLayout } from '~/components/app-layout'
import { SpawnReservations } from '~/components/spawn-reservations'
import { getAreas, getReservations } from '~/lib/api/functions'
import { reservationsQueryOpts } from '~/lib/api/react-query'
import { useAppStoreActions } from '~/lib/state'
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
  const { cleanupExpiredMarkedSpawns } = useAppStoreActions()

  // used to inject the initial data into the cache, we don't need the hook result here
  useQuery({
    ...reservationsQueryOpts,
    initialData: loaderReservations,
  })

  // Cleanup expired marked spawns on mount
  useEffect(() => {
    cleanupExpiredMarkedSpawns()
  }, [cleanupExpiredMarkedSpawns])

  return (
    <AppLayout areas={areas}>
      <SpawnReservations />
    </AppLayout>
  )
}
