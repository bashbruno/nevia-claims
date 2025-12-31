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
}

type Actions = {
  toggleSelectedArea: (areaId: number) => void
  clearSelectedAreas: () => void
  setFilterSearch: (val: string) => void
}

export function useSelectedAreas() {
  return useAppStore((s) => s.state.selectedAreasIds)
}

export function useFilterSearch() {
  return useAppStore((s) => s.state.filterSearch)
}

export function useAppStoreActions() {
  return useAppStore((s) => s.actions)
}

const useAppStore = create<AppStore>()(
  persist(
    immer((set, get) => ({
      state: {
        selectedAreasIds: new Set(),
        filterSearch: '',
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
      },
    })),
    {
      name: 'app-storage',
      storage: makeStorage(),
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
          },
          // actions are not persisted
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  }
}
