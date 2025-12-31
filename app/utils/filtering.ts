import type { Area, ReservationsResponse } from '~/lib/api/types'

export function matchesSearchTerm(target: string, search: string): boolean {
  if (!search.trim()) return true
  return target.toLowerCase().includes(search.toLowerCase())
}

export function hasMatchingSpawnName(area: Area, search: string): boolean {
  return area.respawns.some((spawn) => matchesSearchTerm(spawn, search))
}

export function hasMatchingPlayerName(
  areaId: number,
  search: string,
  reservationsData: ReservationsResponse | undefined,
): boolean {
  const areaReservations = reservationsData?.find((r) => r.id === areaId)
  if (!areaReservations) return false

  return areaReservations.respawnReservations.some((spawnRes) =>
    spawnRes.reservations.some((reservation) =>
      matchesSearchTerm(reservation.characterName, search),
    ),
  )
}

export function hasMatchingPlayerInSpawn(
  spawnName: string,
  areaId: number,
  search: string,
  reservationsData: ReservationsResponse | undefined,
): boolean {
  const areaReservations = reservationsData?.find((r) => r.id === areaId)
  if (!areaReservations) return false

  const spawnReservations = areaReservations.respawnReservations.find(
    (r) => r.name === spawnName,
  )
  if (!spawnReservations) return false

  return spawnReservations.reservations.some((reservation) =>
    matchesSearchTerm(reservation.characterName, search),
  )
}
