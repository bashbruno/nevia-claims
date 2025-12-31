import { useMemo } from 'react'
import { Accordion } from '~/components/accordion'
import { ReservationDisplay } from '~/components/reservation-display'
import { useAreas } from '~/hooks/use-areas'
import { useReservations } from '~/lib/api/react-query'
import type { Area } from '~/lib/api/types'
import { useFilterSearch, useSelectedAreas } from '~/lib/state'
import {
  hasMatchingPlayerInSpawn,
  hasMatchingPlayerName,
  hasMatchingSpawnName,
  matchesSearchTerm,
} from '~/utils/filtering'

export function SpawnReservations() {
  const areas = useAreas()
  const search = useFilterSearch()
  const selectedAreas = useSelectedAreas()
  const reservations = useReservations()

  const filtered = useMemo(() => {
    let result = areas

    if (selectedAreas.size > 0) {
      result = result.filter((area) => selectedAreas.has(area.id))
    }

    if (search.trim()) {
      result = result.filter((area) => {
        return (
          hasMatchingSpawnName(area, search) ||
          hasMatchingPlayerName(area.id, search, reservations.data)
        )
      })
    }

    return result
  }, [search, areas, selectedAreas, reservations.data])

  return (
    <ul className="p-4 space-y-3">
      {filtered.map((a) => (
        <li key={a.id}>
          <AreaAccordion area={a} />
        </li>
      ))}
    </ul>
  )
}

function AreaAccordion({ area }: { area: Area }) {
  const search = useFilterSearch()
  const reservations = useReservations()

  const filteredSpawns = useMemo(() => {
    if (!search.trim()) return area.respawns

    return area.respawns.filter((spawn) => {
      return (
        matchesSearchTerm(spawn, search) ||
        hasMatchingPlayerInSpawn(spawn, area.id, search, reservations.data)
      )
    })
  }, [search, area, reservations.data])

  return (
    <Accordion.Container name={`accordion-area-${area.id}`} open>
      <Accordion.Title>{area.name}</Accordion.Title>
      <Accordion.Content className="space-y-3">
        {filteredSpawns.map((spawn) => (
          <SpawnAccordion key={spawn} spawn={spawn} areaId={area.id} />
        ))}
      </Accordion.Content>
    </Accordion.Container>
  )
}

type SpawnAccordionProps = {
  spawn: string
  areaId: number
}

function SpawnAccordion({ spawn, areaId }: SpawnAccordionProps) {
  const reservations = useReservations()
  const areaReservartions = reservations.data?.find((r) => r.id === areaId)
  const spawnReservations = areaReservartions?.respawnReservations.find(
    (r) => r.name === spawn,
  )

  const isEmpty = !spawnReservations?.reservations.length

  return (
    <Accordion.Container name={`accordion-respawn-${spawn}`} open>
      <Accordion.Title>{spawn}</Accordion.Title>
      <Accordion.Content className="space-y-3">
        {isEmpty && (
          <p className="text-center">
            This spawn has no claims. It's completely free!
          </p>
        )}
        {spawnReservations?.reservations.map((r) => (
          <ReservationDisplay key={r.id} reservation={r} />
        ))}
      </Accordion.Content>
    </Accordion.Container>
  )
}
