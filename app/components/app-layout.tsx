import NiceModal from '@ebay/nice-modal-react'
import { createContext, type PropsWithChildren, useContext } from 'react'
import { Header } from '~/components/header'
import { Sidebar } from '~/components/sidebar'
import type { AreasResponse } from '~/lib/api/types'
import { useHasHydrated } from '~/lib/state'

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
  const hasHydrated = useHasHydrated()

  if (!hasHydrated) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    )
  }

  return (
    <AppLayoutContext.Provider value={{ areas }}>
      <NiceModal.Provider>
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </NiceModal.Provider>
    </AppLayoutContext.Provider>
  )
}
