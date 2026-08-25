// ──────────────────────────────────────────────
// Router — login + not-found + landing
// ──────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Landing from '../pages/Landing'
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
    path: '/landing',
    element: <Landing />,
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
