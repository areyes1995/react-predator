# Frontend - Servicios

## 1. HTTP API Client (`services/api.ts`)

### Token Management
```typescript
function getToken()       → localStorage.auth_token
getRefreshToken()        → localStorage.refresh_token
```

### Auto-Refresh on 401
```typescript
request(path, options) → response.status === 401
  → refreshSession() → POST /auth/refresh with refresh_token
  → retry original request if refresh succeeds
  → notify unauthorized handler if refresh fails
```

### HTTP Methods
```typescript
get<T>(path, params?)      → GET request
post<T>(path, body?)       → POST request
put<T>(path, body?)        → PUT request
patch<T>(path, body?)      → PATCH request
del<T>(path)               → DELETE request
```

### Response Format
```typescript
interface ApiResponse<T> {
  ok: boolean
  status: number
  data: T
  error?: string
}
```

## 2. Auth Service (`services/auth.ts`)

### Interfaces
```typescript
interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: string
  roles?: string[]
  permissions?: string[]
  isActive?: boolean
  avatarUrl?: string
}

interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresAt: string
}

interface LoginCredentials {
  email: string
  password: string
}
```

### Functions
```typescript
login(credentials)          → POST /auth/{method}/login
validateToken(token)        → GET /auth/me
logout()                    → POST /auth/logout
hasPermission(user, perm)   → client-side permission check
preValidateCredentials()    → client-side validation
```

### Auth Methods
| Method   | Endpoint                | Config Env              |
|----------|------------------------|-------------------------|
| DB       | `/auth/login`          | `VITE_AUTH_METHOD=db`   |
| LDAP     | `/auth/ldap/login`     | `VITE_AUTH_METHOD=ldap` |

### LDAP Config
```typescript
LDAP_CONFIG = {
  host: process.env.VITE_LDAP_HOST,
  port: process.env.VITE_LDAP_PORT,
  baseDn: process.env.VITE_LDAP_BASE_DN,
}
```

## 3. Auth Context (`context/AuthContext.tsx`)

### State
```typescript
interface AuthContextState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}
```

### Actions
```typescript
login(credentials)        → call auth.login() → set user + token
logout()                  → call auth.logout() → clear state
checkAuth()               → validateToken() on mount
```

## 4. RBAC Service (`services/rbac.ts`)

### Functions
```typescript
getUserPermissions(user)   → extract permissions from user.roles
checkPermission(permission) → check against current user
hasRole(role)              → check user role
```

## 5. Module Validator (`services/module-validator.ts`)

### Functions
```typescript
validateModule(module)     → validate module config
validateView(view)         → validate view configuration
```

## 6. Config Services

### JSON Config (`services/json-config.ts`)
```typescript
get(configKey) → fetch from /local-config/{key}.json
save(configKey, data) → POST to /local-config/{key}.json
```

### Config Events (`services/config-events.ts`)
```typescript
onConfigChange(callback) → listen for config updates
```

## 7. RAG Service (`services/rag.ts`)

### Functions
```typescript
uploadDocument(file)      → POST /rag/upload
search(query)             → GET /rag/search?query=...
listDocuments()           → GET /rag/documents
```

## 8. Service Flow

```
Page → Service → api.ts → fetch
                          → token from localStorage
                          → refresh on 401
                          → response parsing
                          → context update
```
