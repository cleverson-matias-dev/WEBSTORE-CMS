import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Sidebar - Fixa à esquerda em telas grandes */}
      <Sidebar className="hidden border-r bg-muted/40 lg:block" />

      <div className="flex flex-col">
        {/* Header - Topo fixo ou scroll com a página */}
        <Header />

        {/* Conteúdo Principal - Onde as rotas filhas serão renderizadas */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
