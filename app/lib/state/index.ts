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
}

type Actions = {
  toggleSelectedArea: (areaId: number) => void
  clearSelectedAreas: () => void
  setFilterSearch: (val: string) => void
  toggleFavoritedSpawn: (spawnName: string) => void
  toggleShowOnlyFavorited: () => void
  toggleAccordion: (accordionName: string) => void
  setCharacterName: (name: string) => void
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
      },
    })),
    {
      name: 'app-storage',
      storage: makeStorage(),
      onRehydrateStorage: () => (state) => {
        if (state?.state) {
          state.state.hasHydrated = true
        }
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
          },
          // actions are not persisted
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  }
}
