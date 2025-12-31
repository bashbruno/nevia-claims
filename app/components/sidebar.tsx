import { AreaCheckbox } from '~/components/area-checkbox'
import { useAreas } from '~/hooks/use-areas'
import { useAppStoreActions, useSelectedAreas } from '~/lib/state'

export function Sidebar() {
  const areas = useAreas()
  const selectedAreas = useSelectedAreas()
  const { toggleSelectedArea } = useAppStoreActions()

  const showClearBtn = selectedAreas.size > 0

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
              onChange={() => toggleSelectedArea(a.id)}
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
  const { clearSelectedAreas } = useAppStoreActions()

  return (
    <button
      className="btn btn-active btn-secondary w-full rounded-lg"
      type="button"
      onClick={clearSelectedAreas}
    >
      Clear
    </button>
  )
}
