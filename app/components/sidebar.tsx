import { AreaCheckbox } from '~/components/area-checkbox'
import { useAreas } from '~/hooks/use-areas'
import {
  useAppStoreActions,
  useFilterSearch,
  useSelectedAreas,
  useShowOnlyFavorited,
} from '~/lib/state'

export function Sidebar() {
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
    <aside className="w-max border-r border-r-neutral-700 p-4 space-y-3 overflow-y-auto">
      {showClearBtn && <ClearButton />}
      <ul className="flex flex-col">
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
    </aside>
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
