# Frontend - Arquitectura del Sistema

## 1. Component Architecture

```
┌────────────────────────────────────────────────┐
│                 App (App.tsx)                    │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ ThemeProvider│  │AuthProvider  │              │
│  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                      │
│     RouterProvider (React Router)                 │
└────────────────────────────────────────────────┘
```

## 2. Component Tree

```
AppLayout
├── Header
│   ├── UserMenu (dropdown)
│   ├── ThemeToggle
│   └── NotificationBell
├── Sidebar
│   ├── NavigationMenu
│   │   ├── Home Link
│   │   ├── Records (dropdown)
│   │   ├── Reports Link
│   │   ├── Admin Link
│   │   └── Settings Link
│   └── UserBadge
└── MainContent (Outlet)
```

## 3. Page Components

| Page        | Component            | Route               | Auth    |
|-------------|---------------------|----------------------|---------|
| Login       | `Login.tsx`         | `/login`            | Guest   |
| Home        | `HomePage`          | `/app/home`         | Protected |
| Records     | `RecordsPage`       | `/app/records/:base/:view` | Protected |
| Reports     | `ReportsPage`       | `/app/reports`      | Protected |
| Admin       | `AdminPage`         | `/app/admin`        | Protected |
| Integrations| `ConnectionsPage`   | `/app/connections`  | Protected |
| Settings    | `SettingsView`      | `/app/settings`     | Protected |

## 4. Service Layer

### HTTP Client (`services/api.ts`)
```typescript
// Token management
getToken()           → localStorage.auth_token
getRefreshToken()    → localStorage.refresh_token

// Auto-refresh on 401
request() → 401? → refreshSession() → retry once

// HTTP methods
get<T>(), post<T>(), put<T>(), patch<T>(), del<T>()
```

### Auth Service (`services/auth.ts`)
```typescript
login(credentials) → POST /auth/{method}/login
validateToken()    → GET  /auth/me
logout()           → POST /auth/logout
hasPermission()    → client-side check
```

## 5. Route Guards

```typescript
<ProtectedRoute>  → isLoading → LoadingScreen / !isAuthenticated → /login
<GuestRoute>      → isLoading → LoadingScreen / isAuthenticated  → /app
<IndexRedirect>   → redirects to /app or /login based on auth
```

## 6. Dynamic Records System

```
RECORD_MODULES → [{slug, label, viewOptions}]
└── Filtered by: hasPermission(user, `module:${slug}`)
    └── View-level permissions: `module:slug:view`
```

## 7. Data Flow

```
Page Component
    ↓
Service (api.ts, auth.ts)
    ↓
fetch → localStorage (token)
    ↓
Page Component (state update)
```

## 8. Context Providers

| Context         | State                     | Provider      |
|-----------------|---------------------------|---------------|
| Theme           | light/dark, toggle()      | ThemeContext  |
| Auth            | user, token, isLoading    | AuthContext   |
| ReloadNotify    | show/hide toast           | ReloadNotify  |
