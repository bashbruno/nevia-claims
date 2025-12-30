import { useAppStoreActions, useFilterSearch } from '~/lib/state'
import { SearchInput } from './search-input'

export function Header() {
  const search = useFilterSearch()
  const { setFilterSearch } = useAppStoreActions()

  return (
    <header className="p-4 border-b border-b-secondary space-y-4">
      <h1 className="text-2xl font-semibold">Nevia Claims</h1>
      <SearchInput
        label="Search spawn or player name"
        placeholder="Search spawn or player name"
        value={search}
        onChange={(e) => setFilterSearch(e.target.value)}
      />
    </header>
  )
}
