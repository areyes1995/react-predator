// ──────────────────────────────────────────────
// Guards — lógica de acceso/sesión de la app.
// Componentes puros de protección de rutas.
// ──────────────────────────────────────────────

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

export function LoadingScreen() {
  return (
    <div className="app-loading">
      <div className="spinner-lg" />
      <p>Loading session…</p>
    </div>
  )
}

/** Requiere sesión activa; redirige a /login si no la hay. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/** Solo accesible sin sesión; redirige a /app si ya está autenticado. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

/** Index: redirige según autenticación. */
export function IndexRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return <Navigate to={isAuthenticated ? '/app' : '/login'} replace />
}