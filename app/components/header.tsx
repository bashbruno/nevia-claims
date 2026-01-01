import { MobileSidebar } from '~/components/mobile-sidebar'
import { SearchInput } from '~/components/search-input'
import {
  useAppStoreActions,
  useFilterSearch,
  useShowOnlyFavorited,
} from '~/lib/state'

export function Header() {
  const search = useFilterSearch()
  const showOnlyFavorited = useShowOnlyFavorited()
  const { setFilterSearch, toggleShowOnlyFavorited, clearSelectedAreas } =
    useAppStoreActions()

  const handleSearchChange = (value: string) => {
    setFilterSearch(value)
    if (value.trim()) {
      clearSelectedAreas()
      if (showOnlyFavorited) {
        toggleShowOnlyFavorited()
      }
    }
  }

  const handleToggleFavorites = () => {
    if (search.trim()) {
      setFilterSearch('')
    }
    clearSelectedAreas()
    toggleShowOnlyFavorited()
  }

  return (
    <header className="p-4 border-b border-b-neutral-700 space-y-4">
      <div className="grid grid-cols-2 items-center">
        <h1 className="text-lg lg:text-2xl font-semibold">Nevia Claims</h1>
        <MobileSidebar />
      </div>
      <SearchInput
        label="Search spawn or player name"
        placeholder="Search spawn or player name"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={showOnlyFavorited}
          onChange={handleToggleFavorites}
        />
        <span className="label-text hover:underline underline-offset-2 text-sm md:text-base">
          Show favorites
        </span>
      </label>
    </header>
  )
}
