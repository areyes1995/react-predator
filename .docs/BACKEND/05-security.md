# Backend - Seguridad

## 1. Autenticaci\u00f3n JWT

| Propiedad       | Valor                                  |
|-----------------|----------------------------------------|
| Algorithm       | HS256 (HMAC-SHA256)                    |
| Secret Source   | `process.env.SECRET_PASSPORT`          |
| Token Expiry    | Configurable (env var)                 |
| Refresh Token   | Implementado                           |

**Flujo:**
```
POST /auth/local/login → validateUser → bcrypt.compare → sign JWT → Response
GET /api/... → JWT Auth Guard → Roles Guard → Controller
```

## 2. Password Handling

```typescript
import bcrypt from 'bcrypt';

// Hashing
const hash = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(password, passwordHash);
```

## 3. Autorizaci\u00f3n (RBAC)

### Modelo
```
SystemUser ──[N:N]── SystemUserRole ──[N:N]── RolePermission ──[N:1]── Permission ── [1:N]── Resource
```

### Guards
```typescript
@Roles('SUPERADMIN', 'ADMIN')
@Get('protected')
getProtected() { ... }
```

## 4. Secretos en Reposo

| Propiedad       | Valor                                  |
|-----------------|----------------------------------------|
| Algorithm       | AES-256-GCM                            |
| Field           | `credentialsEncrypted`                 |
| Library         | `crypto.createCipheriv`                |

```typescript
const encrypted = encrypt(data, process.env.ENCRYPTION_KEY);
const decrypted = decrypt(encrypted, process.env.ENCRYPTION_KEY);
```

## 5. Validaci\u00f3n de Entrada

```typescript
.pipe(new ValidationPipe({ whitelist: true, transform: true }))
```

- class-validator (IsString, IsEmail, IsNumber, IsOptional, etc.)
- class-transformer (Expose, Transform)
- Joi validation schema en AppModule

## 6. CORS

```typescript
CORS: {
  credentials: true,
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}
```

## 7. Logging de Auditor\u00eda

| Logger    | File Pattern         | Retention |
|-----------|---------------------|-----------|
| info      | combined-%DATE%.log  | 14d       |
| error     | error-%DATE%.log     | 7d        |
| auth      | auth-%DATE%.log      | 14d       |

## 8. Headers de Seguridad

```typescript
helmet(),
xss()
```
