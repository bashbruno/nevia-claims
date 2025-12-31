import { useFilterSearch } from '~/lib/state'

type HighlitableBySearchProps = {
  text: string
}

export function HighlitableBySearch({ text }: HighlitableBySearchProps) {
  const search = useFilterSearch()

  if (!search.trim()) {
    return <span>{text}</span>
  }

  const searchLower = search.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(searchLower)

  if (index === -1) {
    return <span>{text}</span>
  }

  const before = text.slice(0, index)
  const match = text.slice(index, index + search.length)
  const after = text.slice(index + search.length)

  return (
    <span>
      {before}
      <mark className="bg-yellow-400 text-black px-0.5 rounded">{match}</mark>
      {after.includes(search) ? <HighlitableBySearch text={after} /> : after}
    </span>
  )
}
