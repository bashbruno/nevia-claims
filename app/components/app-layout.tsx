import { createContext, type PropsWithChildren, useContext } from 'react'
import { Header } from '~/components/header'
import { Sidebar } from '~/components/sidebar'
import type { AreasResponse } from '~/lib/api/types'

type AppContext = {
  areas: AreasResponse
}

const AppLayoutContext = createContext<AppContext | null>(null)

export function useAppContext() {
  const ctx = useContext(AppLayoutContext)
  if (!ctx) throw new Error('AppLayout not found in the tree')
  return ctx
}

type AppLayoutProps = PropsWithChildren<{
  areas: AreasResponse
}>

export function AppLayout({ children, areas }: AppLayoutProps) {
  return (
    <AppLayoutContext.Provider value={{ areas }}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AppLayoutContext.Provider>
  )
}
