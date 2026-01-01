import NiceModal from '@ebay/nice-modal-react'
import { Hand, Star } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { Accordion } from '~/components/accordion'
import { ClaimSpawnModal } from '~/components/claim-spawn-modal'
import { HighlitableBySearch } from '~/components/highlitable-by-search'
import { ReservationDisplay } from '~/components/reservation-display'
import { useAreas } from '~/hooks/use-areas'
import { useReservations } from '~/lib/api/react-query'
import type { Area } from '~/lib/api/types'
import {
  useAppStoreActions,
  useFavoritedSpawns,
  useFilterSearch,
  useSelectedAreas,
  useShowOnlyFavorited,
} from '~/lib/state'
import { hasMatchingPlayerInSpawn, matchesSearchTerm } from '~/utils/filtering'

export function SpawnReservations() {
  const areas = useAreas()
  const search = useFilterSearch()
  const selectedAreas = useSelectedAreas()
  const showOnlyFavorited = useShowOnlyFavorited()
  const favoritedSpawns = useFavoritedSpawns()
  const reservations = useReservations()

  const getFilteredSpawns = useCallback(
    (area: Area) => {
      let spawns = area.respawns

      if (showOnlyFavorited) {
        spawns = spawns.filter((spawn) => favoritedSpawns.has(spawn))
      }

      if (search.trim()) {
        spawns = spawns.filter((spawn) => {
          return (
            matchesSearchTerm(spawn, search) ||
            hasMatchingPlayerInSpawn(spawn, area.id, search, reservations.data)
          )
        })
      }

      return spawns
    },
    [favoritedSpawns, showOnlyFavorited, search, reservations.data],
  )

  const filtered = useMemo(() => {
    let result = areas

    if (selectedAreas.size > 0) {
      result = result.filter((area) => selectedAreas.has(area.id))
    }

    result = result.filter((area) => getFilteredSpawns(area).length > 0)

    return result
  }, [areas, selectedAreas, getFilteredSpawns])

  const noResults = !filtered.length

  if (noResults) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <p>No results found.</p>
      </div>
    )
  }

  return (
    <div className="h-full p-4">
      <Virtuoso
        style={{ height: '100%' }}
        data={filtered}
        itemContent={(idx, a) => (
          <div style={{ paddingTop: idx === 0 ? 0 : 12 }}>
            <AreaAccordion area={a} filteredSpawns={getFilteredSpawns(a)} />
          </div>
        )}
      />
    </div>
  )
}

type AreaAccordionProps = {
  area: Area
  filteredSpawns: string[]
}

function AreaAccordion({ area, filteredSpawns }: AreaAccordionProps) {
  const search = useFilterSearch()
  const selectedAreas = useSelectedAreas()
  const hasActiveSearch = !!search.trim() || selectedAreas.size > 0

  return (
    <Accordion.Container
      name={`accordion-area-${area.id}`}
      forceOpen={hasActiveSearch}
    >
      <Accordion.Title>
        <span className="hover:underline underline-offset-2 text-sm md:text-base">
          {area.name}
        </span>
      </Accordion.Title>
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
  const { toggleFavoritedSpawn } = useAppStoreActions()
  const reservations = useReservations()
  const favoritedSpawns = useFavoritedSpawns()
  const search = useFilterSearch()
  const selectedAreas = useSelectedAreas()
  const areaReservartions = reservations.data?.find((r) => r.id === areaId)
  const spawnReservations = areaReservartions?.respawnReservations.find(
    (r) => r.name === spawn,
  )

  const isEmpty = !spawnReservations?.reservations.length
  const hasActiveSearch = !!search.trim() || selectedAreas.size > 0

  return (
    <Accordion.Container
      name={`accordion-respawn-${spawn}`}
      forceOpen={hasActiveSearch}
    >
      <Accordion.Title className="flex gap-2 items-center">
        <button
          type="button"
          className="btn btn-square bg-transparent border-none hover:bg-neutral"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavoritedSpawn(spawn)
          }}
        >
          <Star
            size={18}
            fill={favoritedSpawns.has(spawn) ? 'yellow' : 'transparent'}
          />
        </button>

        <button
          type="button"
          className="btn btn-square bg-transparent border-none hover:bg-neutral"
          onClick={(e) => {
            e.stopPropagation()
            NiceModal.show(ClaimSpawnModal, { spawnName: spawn, areaId })
          }}
        >
          <Hand size={18} />
        </button>

        <span className="hover:underline underline-offset-2">
          <HighlitableBySearch text={spawn} />
        </span>
      </Accordion.Title>
      <Accordion.Content className="space-y-3">
        {isEmpty && (
          <p className="text-center text-xs md:text-sm">
            This spawn has no claims. It's completely free!
          </p>
        )}
        {spawnReservations?.reservations.map((r) => (
          <ReservationDisplay key={r.id} reservation={r} spawnName={spawn} />
        ))}
      </Accordion.Content>
    </Accordion.Container>
  )
}
