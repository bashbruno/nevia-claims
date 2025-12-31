import { Star } from 'lucide-react'
import {
  useAppStoreActions,
  useFilterSearch,
  useShowOnlyFavorited,
} from '~/lib/state'
import { SearchInput } from './search-input'

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
      <h1 className="text-2xl font-semibold">Nevia Claims</h1>
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
        <span className="label-text">Show favorites</span>
      </label>
    </header>
  )
}
