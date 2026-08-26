// ──────────────────────────────────────────────
// Router — tabla de rutas de la aplicación.
// La lógica de acceso (guards y redirecciones por
// permiso) vive en ./guards y ./records-route; aquí
// solo se declara el árbol de rutas.
// ──────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import { AppLayout } from '../components/layout'
import HomePage from '../pages/home/HomePage'
import ConnectionsPage from '../pages/integrations/ConnectionsPage'
import AdminPage from '../pages/admin/AdminPage'
import { ProtectedRoute, GuestRoute, IndexRedirect } from './guards'
import { RecordsRoute } from './records-route'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    index: true,
    element: <IndexRedirect />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'records/:base?/:view?', element: <RecordsRoute /> },
      { path: 'connections', element: <ConnectionsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])