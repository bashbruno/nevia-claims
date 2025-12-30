import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from '@/components/sidebar'
import { useAreas, useReservations } from '@/lib/api/hooks'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

function AppContent() {
  const areas = useAreas()
  const reservations = useReservations()
  const isLoading = areas.isLoading || reservations.isLoading

  if (isLoading) return null

  return (
    <main className="min-h-screen flex">
      <Sidebar areas={areas.data} />
    </main>
  )
}
