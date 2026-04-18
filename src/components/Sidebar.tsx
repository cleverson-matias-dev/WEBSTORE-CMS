import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LayoutDashboard 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar({ className }: { className?: string }) {
  const { pathname } = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/' },
    { label: 'Produtos', icon: Package, path: '/products' },
    { label: 'Pedidos', icon: ShoppingCart, path: '/orders' },
    { label: 'Clientes', icon: Users, path: '/customers' },
    { label: 'Configurações', icon: Settings, path: '/settings' },
  ]

  return (
    <aside className={cn("pb-12", className)}>
      <div className="flex h-full flex-col gap-2">
        {/* Logo/Nome do CMS */}
        <div className="flex h-15 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <LayoutDashboard className="h-6 w-6" />
            <span>Store Admin</span>
          </Link>
        </div>

        {/* Links de Navegação */}
        <div className="flex-1 px-3 py-4">
          <nav className="grid gap-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.path 
                    ? "bg-muted text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
