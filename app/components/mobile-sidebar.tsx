import { Menu } from 'lucide-react'
import { AreaCheckbox } from '~/components/area-checkbox'
import { useAreas } from '~/hooks/use-areas'
import {
  useAppStoreActions,
  useFilterSearch,
  useSelectedAreas,
  useShowOnlyFavorited,
} from '~/lib/state'

export function MobileSidebar() {
  const areas = useAreas()
  const selectedAreas = useSelectedAreas()
  const search = useFilterSearch()
  const showOnlyFavorited = useShowOnlyFavorited()
  const { toggleSelectedArea, setFilterSearch, toggleShowOnlyFavorited } =
    useAppStoreActions()

  const showClearBtn = selectedAreas.size > 0

  const handleToggleArea = (areaId: number) => {
    if (search.trim()) {
      setFilterSearch('')
    }
    if (showOnlyFavorited) {
      toggleShowOnlyFavorited()
    }
    toggleSelectedArea(areaId)
  }

  return (
    <div className="drawer lg:hidden">
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex justify-end">
        <label
          htmlFor="my-drawer-1"
          className="btn btn-ghost drawer-button pr-0"
        >
          <Menu />
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-1"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="flex flex-col menu bg-base-200 min-h-full w-80 p-4">
          {showClearBtn && <ClearButton />}
          {areas.map((a) => {
            const isSelected = selectedAreas.has(a.id)
            return (
              <AreaCheckbox
                key={a.id}
                checked={isSelected}
                onChange={() => handleToggleArea(a.id)}
              >
                {a.name}
              </AreaCheckbox>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function ClearButton() {
  const { clearSelectedAreas, setFilterSearch, toggleShowOnlyFavorited } =
    useAppStoreActions()
  const showOnlyFavorited = useShowOnlyFavorited()

  const handleClear = () => {
    setFilterSearch('')
    if (showOnlyFavorited) {
      toggleShowOnlyFavorited()
    }
    clearSelectedAreas()
  }

  return (
    <button
      className="btn btn-active btn-secondary w-full rounded-lg"
      type="button"
      onClick={handleClear}
    >
      Clear
    </button>
  )
}
