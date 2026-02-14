import { RefreshCw } from 'lucide-react'
import { MobileSidebar } from '~/components/mobile-sidebar'
import { SearchInput } from '~/components/search-input'
import { useReservations } from '~/lib/api/react-query'
import {
  useAppStoreActions,
  useFilterSearch,
  useShowOnlyFavorited,
  useShowOnlyMine,
} from '~/lib/state'

export function Header() {
  const search = useFilterSearch()
  const showOnlyFavorited = useShowOnlyFavorited()
  const showOnlyMine = useShowOnlyMine()
  const {
    setFilterSearch,
    toggleShowOnlyFavorited,
    toggleShowOnlyMine,
    clearSelectedAreas,
  } = useAppStoreActions()
  const { refetch, isFetching } = useReservations()

  const handleSearchChange = (value: string) => {
    setFilterSearch(value)
    if (value.trim()) {
      clearSelectedAreas()
      if (showOnlyFavorited) {
        toggleShowOnlyFavorited()
      }
      if (showOnlyMine) {
        toggleShowOnlyMine()
      }
    }
  }

  const handleToggleFavorites = () => {
    if (search.trim()) {
      setFilterSearch('')
    }
    clearSelectedAreas()
    if (showOnlyMine) {
      toggleShowOnlyMine()
    }
    toggleShowOnlyFavorited()
  }

  const handleToggleMine = () => {
    if (search.trim()) {
      setFilterSearch('')
    }
    clearSelectedAreas()
    if (showOnlyFavorited) {
      toggleShowOnlyFavorited()
    }
    toggleShowOnlyMine()
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={showOnlyMine}
            onChange={handleToggleMine}
          />
          <span className="label-text hover:underline underline-offset-2 text-sm md:text-base">
            Show only mine
          </span>
        </label>
        <button
          type="button"
          className="btn btn-primary btn-sm gap-2 w-full md:w-auto md:ml-auto"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span className="text-sm md:text-base">Refresh Data</span>
        </button>
      </div>
    </header>
  )
}
