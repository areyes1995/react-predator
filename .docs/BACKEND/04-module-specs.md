# Backend - Especificaciones de M\u00f3dulos

## 1. AuthModule

**Responsabilidad:** Autenticaci\u00f3n JWT + Passport

**Componentes:**
- `AuthController` - Endpoints REST
- `AuthService` - L\u00f3gica de auth
- `JwtAuthGuard`, `LocalAuthGuard`, `RolesGuard` - Guardas
- `JwtStrategy`, `LocalStrategy` - Passport strategies

**Flujo:**
```
POST /auth/local/login
→ LocalStrategy → AuthService → SystemUser (DB)
→ JWT sign → Response
→ AuthLog (LOGIN_SUCCESS)
```

**Contratos:**
```typescript
export interface IAuthService {
  validateUser(email: string, pass: string): Promise<any>;
  login(user: any): Promise<any>;
  refreshToken(payload: any): Promise<string>;
}
```

## 2. SystemUserModule

**Responsabilidad:** CRUD de usuarios

**DTOs:** `CreateSystemUserDto`, `UpdateSystemUserDto`

**Interface:**
```typescript
export interface ISystemUserRepository {
  findOne(where: Prisma.SystemUserWhereInput): Promise<SystemUser | null>;
  findMany(params: {...}): Promise<SystemUser[]>;
  create(data: Prisma.SystemUserCreateInput): Promise<SystemUser>;
  update(where, data): Promise<SystemUser>;
  delete(where): Promise<SystemUser>;
  count(where?): Promise<number>;
}
```

## 3. RbacModule

**Responsabilidad:** Roles, recursos, permisos

**Modelo:**
```
SystemUser ──[N:N]── SystemUserRole ──[N:N]── RolePermission ──[N:1]── Permission ── [1:N]── Resource
```

**Decorator:** `@Roles('SUPERADMIN', 'ADMIN')`

## 4. StorageModule

**Responsabilidad:** Azure Blob Storage

**Interface:**
```typescript
export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<StorageResult>;
  downloadFile(fileName: string): Promise<Buffer>;
  listBlobs(prefix?: string): Promise<BlobItem[]>;
}
```

## 5. AiAnalysisModule

**Responsabilidad:** Orquestaci\u00f3n de IA con trazabilidad

**Entidad:** `AiAnalysis` (prompt, response, tokens, costo)

## 6. DocumentModule

**Responsabilidad:** Azure Document Intelligence

**Flujo:** File → Storage → Azure DI → Text extraction

## 7. NotificationModule

**Responsabilidad:** Notificaciones internas

**DTOs:** `CreateNotificationDto`, `ReadNotificationDto`

## 8. SystemLogModule / AuthLogModule

**Responsabilidad:** Auditor\u00eda y logs de auth

**Eventos:** `LOGIN_SUCCESS`, `LOGIN_FAILED`, `LOGOUT`

## 9. Shared Layer

### Unit of Work
```typescript
export interface IUnitOfWork {
  $transaction<T>(fn: (tx) => Promise<T>): Promise<T>;
}
```

### Filters
- `PrismaExceptionFilter` - Mapea excepciones Prisma a HTTP errors

### LoggerService
```typescript
@Injectable()
export class LoggerService {
  // combined-%DATE%.log (info, max 14d)
  // error-%DATE%.log (error, max 7d)
}
```

## 10. M\u00f3dulos Pendientes (Schema listo, sin implementaci\u00f3n)

| M\u00f3dulo | Entidades | Estado |
|--------|-----------|--------|
| Connections | `Connection` | Schema listo |
| HR Catalogs | `Organization`, `Department`, `Job` | Schema listo |
| Employees | `Employee`, `EmployeeDetail`, `Assignment` | Schema listo |
| Sync | `SyncJob`, `PlatformSyncLog`, `Staging*` | Schema listo |
| Turnover | `EmployeeExit`, `ExitInterview`, `ExitActionItem` | Schema listo |
