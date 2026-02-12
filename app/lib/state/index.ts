import { TZDate } from '@date-fns/tz'
import { parseISO } from 'date-fns'
import { enableMapSet } from 'immer'
import { create } from 'zustand'
import {
  type PersistStorage,
  persist,
  type StorageValue,
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

enableMapSet()

type AppStore = {
  state: State
  actions: Actions
}

type State = {
  selectedAreasIds: Set<number>
  filterSearch: string
  favoritedSpawns: Set<string>
  showOnlyFavorited: boolean
  openAccordions: Set<string>
  hasHydrated: boolean
  characterName: string
  markedAsMySpawns: Map<number, string> // reservationId -> endDate
}

type Actions = {
  toggleSelectedArea: (areaId: number) => void
  clearSelectedAreas: () => void
  setFilterSearch: (val: string) => void
  toggleFavoritedSpawn: (spawnName: string) => void
  toggleShowOnlyFavorited: () => void
  toggleAccordion: (accordionName: string) => void
  setCharacterName: (name: string) => void
  toggleMarkedAsMine: (
    reservationId: number,
    endDate: string,
    characterName: string,
    allReservationsWithSameChar?: Array<{ id: number; endDate: string }>,
  ) => void
  cleanupExpiredMarkedSpawns: () => void
}

export function useSelectedAreas() {
  return useAppStore((s) => s.state.selectedAreasIds)
}

export function useFilterSearch() {
  return useAppStore((s) => s.state.filterSearch)
}

export function useCharacterName() {
  return useAppStore((s) => s.state.characterName)
}

export function useFavoritedSpawns() {
  return useAppStore((s) => s.state.favoritedSpawns)
}

export function useShowOnlyFavorited() {
  return useAppStore((s) => s.state.showOnlyFavorited)
}

export function useIsAccordionOpen(accordionName: string) {
  const accordions = useAppStore((s) => s.state.openAccordions)
  return accordions.has(accordionName)
}

export function useAppStoreActions() {
  return useAppStore((s) => s.actions)
}

export function useHasHydrated() {
  return useAppStore((s) => s.state.hasHydrated)
}

export function useIsMarkedAsMine(reservationId: number) {
  return useAppStore((s) => s.state.markedAsMySpawns.has(reservationId))
}

export function useMarkedAsMySpawns() {
  return useAppStore((s) => s.state.markedAsMySpawns)
}

const useAppStore = create<AppStore>()(
  persist(
    immer((set) => ({
      state: {
        selectedAreasIds: new Set(),
        filterSearch: '',
        favoritedSpawns: new Set(),
        showOnlyFavorited: false,
        openAccordions: new Set(),
        hasHydrated: false,
        characterName: '',
        markedAsMySpawns: new Map(),
      },
      actions: {
        toggleSelectedArea: (areaId) => {
          set((s) => {
            if (s.state.selectedAreasIds.has(areaId)) {
              s.state.selectedAreasIds.delete(areaId)
            } else {
              s.state.selectedAreasIds.add(areaId)
            }
          })
        },
        clearSelectedAreas: () => {
          set((s) => {
            s.state.selectedAreasIds.clear()
          })
        },
        setFilterSearch: (val) => {
          set((s) => {
            s.state.filterSearch = val
          })
        },
        toggleFavoritedSpawn: (spawnName) => {
          set((s) => {
            if (s.state.favoritedSpawns.has(spawnName)) {
              s.state.favoritedSpawns.delete(spawnName)
            } else {
              s.state.favoritedSpawns.add(spawnName)
            }
          })
        },
        toggleShowOnlyFavorited: () => {
          set((s) => {
            s.state.showOnlyFavorited = !s.state.showOnlyFavorited
          })
        },
        toggleAccordion: (accordionName) => {
          set((s) => {
            if (s.state.openAccordions.has(accordionName)) {
              s.state.openAccordions.delete(accordionName)
            } else {
              s.state.openAccordions.add(accordionName)
            }
          })
        },
        setCharacterName: (name) => {
          set((s) => {
            s.state.characterName = name
          })
        },
        toggleMarkedAsMine: (
          reservationId,
          endDate,
          characterName,
          allReservationsWithSameChar,
        ) => {
          set((s) => {
            if (s.state.markedAsMySpawns.has(reservationId)) {
              // Unmark this reservation
              s.state.markedAsMySpawns.delete(reservationId)
            } else {
              // Mark this reservation
              s.state.markedAsMySpawns.set(reservationId, endDate)

              // Also mark all other reservations with the same character name
              if (allReservationsWithSameChar) {
                allReservationsWithSameChar.forEach((res) => {
                  if (res.id !== reservationId) {
                    s.state.markedAsMySpawns.set(res.id, res.endDate)
                  }
                })
              }
            }
          })
        },
        cleanupExpiredMarkedSpawns: () => {
          set((s) => {
            const nowCET = new TZDate(new Date(), 'Europe/Berlin')
            const toDelete: number[] = []

            s.state.markedAsMySpawns.forEach((endDate, reservationId) => {
              // Parse endDate as ISO string and treat it as Berlin time
              const parsed = parseISO(endDate)
              const endDateCET = new TZDate(
                parsed.getFullYear(),
                parsed.getMonth(),
                parsed.getDate(),
                parsed.getHours(),
                parsed.getMinutes(),
                parsed.getSeconds(),
                0,
                'Europe/Berlin',
              )

              // If endDate has passed, mark for deletion
              if (endDateCET.getTime() < nowCET.getTime()) {
                toDelete.push(reservationId)
              }
            })

            toDelete.forEach((id) => {
              s.state.markedAsMySpawns.delete(id)
            })
          })
        },
      },
    })),
    {
      name: 'app-storage',
      storage: makeStorage(),
      onRehydrateStorage: () => (state) => {
        setTimeout(() => {
          if (state?.state) {
            state.state.hasHydrated = true
          }
        }, 1000)
      },
    },
  ),
)

function makeStorage(): PersistStorage<AppStore> {
  return {
    getItem: (name) => {
      const str = localStorage.getItem(name)
      if (!str) return null
      const existingValue = JSON.parse(str)
      return {
        ...existingValue,
        state: {
          ...existingValue.state,
          state: {
            ...existingValue.state.state,
            selectedAreasIds: new Set(
              existingValue.state.state.selectedAreasIds,
            ),
            favoritedSpawns: new Set(existingValue.state.state.favoritedSpawns),
            openAccordions: new Set(existingValue.state.state.openAccordions),
            markedAsMySpawns: new Map(
              existingValue.state.state.markedAsMySpawns,
            ),
          },
        },
      }
    },
    setItem: (name, newValue: StorageValue<AppStore>) => {
      const str = JSON.stringify({
        ...newValue,
        state: {
          state: {
            ...newValue.state.state,
            selectedAreasIds: Array.from(newValue.state.state.selectedAreasIds),
            favoritedSpawns: Array.from(newValue.state.state.favoritedSpawns),
            openAccordions: Array.from(newValue.state.state.openAccordions),
            markedAsMySpawns: Array.from(
              newValue.state.state.markedAsMySpawns.entries(),
            ),
          },
          // actions are not persisted
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  }
}
