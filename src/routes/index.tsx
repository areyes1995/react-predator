// ──────────────────────────────────────────────
// Router — login + not-found
// ──────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import { ProtectedRoute, GuestRoute, IndexRedirect } from './guards'

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
        <Navigate to="/app/home" replace />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', element: <Navigate to="/" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
