import { createBrowserRouter } from 'react-router-dom'

import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardHome } from '@/pages/DashboardHome'
import { OrderList } from '@/pages/OrderList'
import { Login } from '@/pages/Login'
import { Customers } from '@/pages/Customers'
import { Settings } from '@/pages/Settings'
import { Register } from '@/pages/Register'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Unauthorized from '@/pages/Unauthorized'
import NotFound from '@/pages/NotFound'
import ProductsListing from '@/pages/ProductListing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/', element: <DashboardHome /> },
      { path: '/products', element: <ProductsListing/> },
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
  {
    path: '/unauthorized',
    element: <Unauthorized></Unauthorized>
  },
  {
    path: '*',
    element: <NotFound></NotFound>
  }
])
