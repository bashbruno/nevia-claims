import { create } from 'zustand'
import {
  type PersistStorage,
  persist,
  type StorageValue,
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type AppStore = {
  // state
  selectedAreasIds: Set<number>
  // actions
  toggleSelectedArea: (areaId: number) => void
}

export function useSelectedAreas() {
  return useAppStore((s) => s.selectedAreasIds)
}

export function useAppStoreActions() {
  return useAppStore((s) => ({ toggleSelectedArea: s.toggleSelectedArea }))
}

const useAppStore = create<AppStore>()(
  immer(
    persist(
      (set, get) => ({
        // state
        selectedAreasIds: new Set(),

        // actions
        toggleSelectedArea: (areaId) => {
          const found = get().selectedAreasIds.has(areaId)
          if (found) {
            set((s) => {
              s.selectedAreasIds.delete(areaId)
            })
          } else {
            set((s) => {
              s.selectedAreasIds.add(areaId)
            })
          }
        },
      }),
      {
        name: 'app-storage',
        storage: makeStorage(),
      },
    ),
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
          selectedAreasIds: new Set(existingValue.state.selectedAreasIds),
        },
      }
    },
    setItem: (name, newValue: StorageValue<AppStore>) => {
      const str = JSON.stringify({
        ...newValue,
        state: {
          ...newValue.state,
          selectedAreasIds: Array.from(newValue.state.selectedAreasIds),
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  }
}
