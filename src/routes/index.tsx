import { createBrowserRouter } from 'react-router-dom'

import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardHome } from '@/pages/DashboardHome'
import { ProductList } from '@/pages/ProductList'
import { OrderList } from '@/pages/OrderList'
import { Login } from '@/pages/Login'
import { Customers } from '@/pages/Customers'
import { Settings } from '@/pages/Settings'
import { Register } from '@/pages/Register'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />, // O layout com Sidebar e Header
    children: [
      { path: '/', element: <DashboardHome /> },
      { path: '/products', element: <ProductList /> },
      { path: '/orders', element: <OrderList /> },
      { path: '/customers', element: < Customers/> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
])
