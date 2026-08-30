# Backend - Visi\u00f3n General

## 1. Tecnolog\u00eda

| Propiedad      | Valor                              |
|----------------|------------------------------------|
| Framework      | NestJS 11 + TypeScript 5           |
| ORM            | Prisma 7 + PostgreSQL              |
| Auth           | Passport + JWT (HS256)             |
| Queues         | BullMQ + Redis 7                   |
| Logging        | Winston + winston-daily-rotate-file|
| Validation     | class-validator + Joi              |
| API Docs       | Swagger/OpenAPI                    |
| Package Manager| pnpm 10.17.1                       |

## 2. Stack Backend

```
┌─────────────────────────────────────────────┐
│              NestJS Application              │
├─────────────────────────────────────────────┤
│ Controllers → Services → Repositories       │
├─────────────────────────────────────────────┤
│ Prisma Client                               │
├─────────────────────────────────────────────┤
│ PostgreSQL                                  │
└─────────────────────────────────────────────┘
```

## 3. Estructura Backend

```
apps/api/src/
├── main.ts                     # Entry point HTTP
├── main-cli.ts                 # Entry point CLI
├── app.module.ts               # Ra\u00edz del m\u00f3dulo Nest
├── app.controller.ts           # Health check
├── app.service.ts              # Service b\u00e1sico
│
├── modules/                    # M\u00f3dulos funcionales
│   ├── auth/                   # Auth JWT + Passport
│   ├── auth-log/               # Logs de auth
│   ├── system-user/            # Usuarios del sistema
│   ├── SystemLog/              # Auditor\u00eda
│   ├── storage/                # Azure Blob Storage
│   ├── document/               # Azure Document Intelligence
│   ├── ai-analysis/            # IA con OpenAI
│   ├── notification/           # Notificaciones
│   ├── rag/                    # RAG Vector
│   ├── rbac/                   # Permisos RBAC
│   └── config/                 # Config service
│
├── logger/                     # Winston logger
├── shared/                     # C\u00f3digo compartido
│   ├── dtos/
│   ├── filters/
│   ├── helpers/
│   └── unit-of-work/
│
└── storage/                    # Logs rotativos
```

## 4. Principios de Dise\u00f1o

1. **Clean Architecture** - Dependencias apuntan inward
2. **Repository Pattern** - Abstracci\u00f3n DB con interfaces
3. **Dependency Injection** - NestJS DI container
4. **Unit of Work** - Transacciones at\u00f3micas
5. **DTO Validation** - class-validator + class-transformer
6. **Soft Delete** - campo `deletedAt` en todos los modelos
7. **AES-256-GCM** - Secrets stored encrypted at rest
8. **Async Jobs** - BullMQ para background tasks

## 5. Principales Dependencias

```json
{
  "@nestjs/common": "^11.1.26",
  "@nestjs/config": "^4.0.3",
  "@nestjs/core": "^11.1.26",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/platform-express": "^11.1.26",
  "@nestjs/schedule": "^6.1.3",
  "@nestjs/swagger": "^11.4.4",
  "@prisma/client": "^7.9.1",
  "@prisma/adapter-pg": "^7.9.1",
  "@azure/ai-form-recognizer": "^5.1.0",
  "@azure/storage-blob": "^12.31.0",
  "@nestjs/bullmq": "^11.0.4",
  "bullmq": "^5.80.8",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "passport-local": "^1.0.0",
  "pg": "^8.23.0",
  "winston": "^3.17.0",
  "joi": "^18.2.3",
  "class-validator": "^0.14.1",
  "class-transformer": "^0.5.1"
}
```

## 6. Entry Points

### HTTP
```typescript
// main.ts
NestFactory.create(AppModule)
  → ValidationPipe (whitelist, transform)
  → SwaggerModule setup
  → CORS configured
  → cookieParser
  → PrismaExceptionFilter
  → Listen on PORT (default 3000)
```

### CLI
```typescript
// main-cli.ts (nest-commander)
CLI service
  → user:create-admin
  → Otros comandos administrativos
```

## 7. Configuraci\u00f3n Clave

```typescript
// app.module.ts
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({...}),
    }),
    BullModule.forRoot({...}),
    PrismaModule,
    // All feature modules...
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
```

## 8. Variables de Entorno Necesarias

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/app_db"
SECRET_PASSPORT="your-jwt-secret"
REDIS_HOST="redis"
REDIS_PORT="6379"
REDIS_PASSWORD="redispassword"

# Optional
AZURE_STORAGE_CONNECTION_STRING=""
AZURE_DI_ENDPOINT=""
AZURE_DI_KEY=""
OPENAI_API_KEY=""
OPENAI_API_URL=""
PORT="3000"
```

## 9. Health Check

```
GET /health → "Hello World!"
```

Usado por Docker healthcheck y orchestrators.
