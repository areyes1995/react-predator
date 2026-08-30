# Backend - Especificaci\u00f3n API REST

## 1. Generalidades

| Propiedad      | Valor                            |
|----------------|----------------------------------|
| Base URL       | `http://localhost:4000/api` (dev) |
| Producci\u00f3n URL | `http://localhost:8500/api` (prod) |
| Formato        | JSON                             |
| Autenticaci\u00f3n  | Bearer JWT                       |
| Documentaci\u00f3n  | Swagger `/api`                   |
| CORS           | Credentials: true                |
| M\u00e9todos        | GET, POST, PUT, DELETE, PATCH    |

## 2. Endpoints de Autenticaci\u00f3n

| M\u00e9todo | Endpoint              | Descripci\u00f3n             | Auth |
|---------|-----------------------|-------------------------|------|
| POST    | `/auth/local/login`   | Iniciar sesi\u00f3n          | No   |
| POST    | `/auth/local/register`| Registrar usuario       | No   |
| POST    | `/auth/logout`        | Cerrar sesi\u00f3n           | S\u00ED  |
| GET     | `/auth/me`            | Obtener usuario actual  | S\u00ED  |

### POST `/auth/local/login`

**Request Body:**
```json
{ "email": "admin@tuapp.com", "password": "tucontrase\u00f1a" }
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "eyJhbGci...",
    "user": { "id": 1, "email": "admin@tuapp.com", "roles": ["SUPERADMIN"] }
  }
}
```

## 3. Endpoints de Usuarios

| M\u00e9todo | Endpoint                 | Descripci\u00f3n              | Auth |
|---------|--------------------------|--------------------------|------|
| GET     | `/system-users`          | Listar usuarios          | S\u00ED  |
| GET     | `/system-users/:id`      | Obtener usuario          | S\u00ED  |
| POST    | `/system-users`          | Crear usuario            | S\u00ED  |
| PUT     | `/system-users/:id`      | Actualizar usuario       | S\u00ED  |
| DELETE  | `/system-users/:id`      | Soft delete              | S\u00ED  |

## 4. Endpoints de RBAC

| M\u00e9todo | Endpoint                     | Descripci\u00f3n                | Auth |
|---------|------------------------------|----------------------------|------|
| GET     | `/rbac/roles`                | Listar roles               | SUPERADMIN |
| GET     | `/rbac/roles/:id`            | Obtener rol                | SUPERADMIN |
| POST    | `/rbac/roles`                | Crear rol                  | SUPERADMIN |
| PUT     | `/rbac/roles/:id`            | Actualizar rol             | SUPERADMIN |
| DELETE  | `/rbac/roles/:id`            | Eliminar rol               | SUPERADMIN |

### Decorator de Roles
```typescript
@Roles('SUPERADMIN', 'ADMIN')
@Get('protected')
getProtected() { ... }
```

## 5. Endpoints de Logs

| M\u00e9todo | Endpoint                 | Descripci\u00f3n            | Auth |
|---------|--------------------------|------------------------|------|
| GET     | `/system-logs`           | Listar logs            | S\u00ED  |
| GET     | `/auth-logs`             | Listar auth logs       | S\u00ED  |

## 6. Endpoints de Storage

| M\u00e9todo | Endpoint                          | Descripci\u00f3n           | Auth |
|---------|-----------------------------------|-----------------------|------|
| POST    | `/storage/upload`                 | Subir archivo         | S\u00ED  |
| GET     | `/storage/download/:fileName`     | Descargar archivo     | S\u00ED  |
| GET     | `/storage/list`                   | Listar blobs          | S\u00ED  |

## 7. Endpoints de AI

| M\u00e9todo | Endpoint                    | Descripci\u00f3n                | Auth |
|---------|-----------------------------|----------------------------|------|
| POST    | `/ai-analyses`              | Crear an\u00e1lisis IA         | S\u00ED  |
| GET     | `/ai-analyses/:id`          | Obtener an\u00e1lisis           | S\u00ED  |

## 8. Endpoints de Notificaciones

| M\u00e9todo | Endpoint                   | Descripci\u00f3n              | Auth |
|---------|----------------------------|--------------------------|------|
| GET     | `/notifications`           | Listar notificaciones    | S\u00ED  |
| PUT     | `/notifications/:id/read`  | Marcar como le\u00edda        | S\u00ED  |

## 9. Endpoints de Conexiones

| M\u00e9todo | Endpoint                     | Descripci\u00f3n           | Auth |
|---------|------------------------------|-----------------------|------|
| GET     | `/connections`               | Listar conexiones     | S\u00ED  |
| POST    | `/connections`               | Crear conexi\u00f3n       | S\u00ED  |
| POST    | `/connections/:id/test`      | Probar conexi\u00f3n     | S\u00ED  |

## 10. Health Check

| M\u00e9todo | Endpoint    | Descripci\u00f3n    | Auth |
|---------|-------------|----------------|------|
| GET     | `/health`   | Health check   | No   |

## 11. Error Handling

**Formato de Error:**
```json
{ "statusCode": 422, "message": ["email must be an email"] }
```

**C\u00f3digos Comunes:**
| C\u00f3digo | Significado |
|---------|-------------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Error |
