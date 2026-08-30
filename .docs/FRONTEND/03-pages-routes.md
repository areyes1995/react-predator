# Frontend - P\u00e1ginas y Rutas

## 1. Router Config (`routes/index.tsx`)

```typescript
export const router = createBrowserRouter([
  // Login (guest only)
  { path: '/login', element: <GuestRoute><Login /></GuestRoute> },

  // Index redirect
  { index: true, element: <IndexRedirect /> },

  // App (protected, requires auth)
  {
    path: '/app',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      // Home (default redirect)
      { index: true, element: <Navigate to="/app/home" /> },

      // Records (dynamic, permission-based)
      { path: 'records/:base?/:view?', element: <RecordsRoute /> },

      // Reports
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reports/attrition', element: <AttritionReport /> },

      // Connections / Integrations
      { path: 'connections', element: <ConnectionsPage /> },

      // Admin
      { path: 'admin', element: <AdminPage /> },

      // Settings
      { path: 'settings', element: <SettingsView /> },
      { path: 'settings/create-module', element: <CreateModuleView /> },

      // Records creation
      { path: 'records/create', element: <CreateModuleView /> },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
])
```

## 2. Rutas por Permiso

| Ruta                  | Permiso Requerido         | Componente       |
|----------------------|--------------------------|-----------------|
| `/app/home`          | (authenticated)          | HomePage        |
| `/app/records`       | `module:records`         | RecordsPage     |
| `/app/records/roles` | `module:permissions`     | RbacRolesView   |
| `/app/records/permissions` | `module:permissions` | RbacPermissionsView |
| `/app/reports`       | `module:reports`         | ReportsPage     |
| `/app/connections`   | `module:connections`     | ConnectionsPage |
| `/app/admin`         | `module:admin`           | AdminPage       |
| `/app/settings`      | (authenticated)          | SettingsView    |

## 3. Pages Detail

### Login (`pages/Login.tsx`)
- Form: email + password
- Methods: DB / LDAP (configurable via `VITE_AUTH_METHOD`)
- Pre-validation: email format, password length
- Redirect: `/app` on success

### HomePage (`pages/home/HomePage.tsx`)
- Dashboard widgets
- Stats cards
- Quick links

### RecordsPage (`pages/records/RecordsPage.tsx`)
- Dynamic table rendering
- Filtered by `RECORD_MODULES`
- Permission-based views
- Columns from `dynamicColumns.ts`

### ReportsPage (`pages/reports/ReportsPage.tsx`)
- Report list
- Chart components

### AdminPage (`pages/admin/AdminPage.tsx`)
- User management
- Module configuration

## 4. Route Guards Logic

```typescript
// RecordsRoute guard logic
if (!hasPermission(user, 'module:permissions'))
  → redirect to /app/records

if (!hasPermission(user, 'module:records'))
  → redirect to first visible module

if target view requires permission
  → redirect to summary view
```
