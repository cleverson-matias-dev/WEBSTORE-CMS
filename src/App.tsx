import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './lib/query-client'
import { router } from './routes'
import { Toaster } from 'sonner'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* O RouterProvider renderiza a hierarquia definida no routes.tsx */}
      <RouterProvider router={router} />
      
      {/* Componente de notificações do Shadcn */}
      <Toaster richColors />
    </QueryClientProvider>
  )
}
