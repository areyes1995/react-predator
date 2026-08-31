// ──────────────────────────────────────────────
// Router — application route table.
// ──────────────────────────────────────────────

import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import { AppLayout } from '../components/layout'
import HomePage from '../pages/home/HomePage'
import DashboardLayout from '../pages/dashboard/DashboardLayout'
import DashboardPage from '../pages/dashboard/DashboardPage'
import RecordsPage from '../pages/dashboard/records/RecordsPage'
import ReportsPage from '../pages/dashboard/reports/ReportsPage'
import AttritionReport from '../pages/dashboard/reports/AttritionReport'
import AdminPage from '../pages/dashboard/AdminPage'
import ConnectionsPage from '../pages/dashboard/integrations/ConnectionsPage'
import StandsPage from '../pages/dashboard/stands/StandsPage'
import { ProtectedRoute, GuestRoute, IndexRedirect } from './guards'
import { RecordsRoute } from './records-route'
import SettingsView from '../components/settings/SettingsView'
import KnowledgeBasePage from '../pages/dashboard/knowledge-base/KnowledgeBasePage'
import MetricsPage from '../pages/dashboard/metrics/MetricsPage'

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
      { path: 'dashboard', element: <DashboardLayout />, children: [
        { index: true, element: <Navigate to="projects" replace /> },
        { path: 'projects', element: <DashboardPage /> },
        { path: 'stands', element: <StandsPage /> },
        { path: 'records/:base?/:view?', element: <RecordsRoute /> },
        { path: 'records/:base?', element: <RecordsRoute /> },
        { path: 'records', element: <RecordsPage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'reports/attrition', element: <AttritionReport /> },
        { path: 'connections', element: <ConnectionsPage /> },
        { path: 'admin', element: <AdminPage /> },
        { path: 'settings', element: <SettingsView /> },
        { path: 'knowledge-base', element: <KnowledgeBasePage /> },
        { path: 'metrics', element: <MetricsPage /> },
        { path: '*', element: <NotFound /> },
      ]},
      { path: 'records/:base?/:view?', element: <RecordsRoute /> },
      { path: 'records/:base?', element: <RecordsRoute /> },
      { path: 'records', element: <RecordsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reports/attrition', element: <AttritionReport /> },
      { path: 'connections', element: <ConnectionsPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'knowledge-base', element: <KnowledgeBasePage /> },
      { path: 'metrics', element: <MetricsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
