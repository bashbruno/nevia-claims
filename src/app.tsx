import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-2xl text-red-200">a</div>
    </QueryClientProvider>
  )
}
