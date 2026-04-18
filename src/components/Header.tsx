import { Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="flex h-15 items-center gap-4 border-b bg-muted/40 px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos, pedidos..."
              className="w-full bg-background pl-8 md:w-75 lg:w-100"
            />
          </div>
        </form>
      </div>
      
      {/* Avatar/Perfil do Usuário */}
      <button className="rounded-full border p-1 hover:bg-muted">
        <UserCircle className="h-6 w-6 text-muted-foreground" />
      </button>
    </header>
  )
}
