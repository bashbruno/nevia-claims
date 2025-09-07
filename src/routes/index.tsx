import { createFileRoute } from "@tanstack/react-router"
import logo from "../logo.svg"
import { createServerFn } from "@tanstack/react-start"

export const getAreas = createServerFn().handler(async () => {
  const res = await fetch("https://claims-api.nevia.top/areas")
  if (!res.ok) {
    throw new Error("Failed to fetch")
  }
  const json = await res.json()
  return json
})

export const Route = createFileRoute("/")({
  component: App
})

function App() {
  async function handleClick() {
    const areas = await getAreas()
    console.log({ areas })
  }

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <button onClick={handleClick}>get areas</button>
      </header>
    </div>
  )
}
