import { useAppContext } from '~/components/app-layout'
import { AreaCheckbox } from '~/components/area-checkbox'
import { useAppStoreActions, useSelectedAreas } from '~/lib/state'

export function Sidebar() {
  const { areas } = useAppContext()
  const selectedAreas = useSelectedAreas()
  const { toggleSelectedArea } = useAppStoreActions()

  const showClearBtn = Array.from(selectedAreas.values()).some(
    (value) => value === true,
  )

  return (
    <aside className="w-max border-r border-r-secondary p-4 space-y-3">
      {showClearBtn && <ClearButton />}
      <h2 className="font-semibold">Filter Area</h2>
      <ul className="flex flex-col">
        {areas.map((a) => {
          const isSelected = selectedAreas.get(a.id) ?? false
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
      className="btn btn-active btn-accent w-full"
      type="button"
      onClick={clearSelectedAreas}
    >
      Clear
    </button>
  )
}
