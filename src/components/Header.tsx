import { Search, UserCircle, LogOut, User, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from '@/store/auth-store'

export function Header() {

  const user  = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.clearAuth);

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
      
      <DropdownMenu>
        {/* O Trigger é o que ativa o menu (seu avatar) */}
        <DropdownMenuTrigger asChild>
          <button className="rounded-full border p-1 hover:bg-muted outline-none">
            <UserCircle className="h-6 w-6 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        {/* Conteúdo do Dropdown */}
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.fullName || 'Usuário'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || 'exemplo.com.br'}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={()=>logout()}
            className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
