import { Outlet } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Coluna da Esquerda: Branding (Oculta em dispositivos móveis) */}
      <div className="hidden flex-col justify-between bg-zinc-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-3 text-lg font-medium">
          <LayoutDashboard className="h-6 w-6" />
          <span>Store Admin CMS</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg">
            "Este painel transformou a gestão do nosso estoque. Simples, rápido e intuitivo."
          </p>
          <footer className="text-sm text-zinc-400">
            — Equipe de Operações, Logística S.A.
          </footer>
        </div>

        <div className="text-sm">
          &copy; {new Date().getFullYear()} Store Admin - Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna da Direita: Conteúdo (Login, Cadastro, etc) */}
      <div className="relative flex flex-col items-center justify-center p-8">
        {/* Logo para mobile (visível apenas quando a coluna da esquerda some) */}
        <div className="mb-8 flex items-center gap-2 font-bold lg:hidden">
          <LayoutDashboard className="h-8 w-8" />
          <span className="text-xl">Store Admin</span>
        </div>

        <div className="w-full max-w-87.5">
          {/* O Outlet renderizará a página de Login ou Recuperação de Senha */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
