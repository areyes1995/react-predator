# Paginación y Filtros — Modu (Backend)

> **Propósito**: Guía de uso del helper genérico `paginatePrisma` (`src/shared/helpers/prisma-pagination.helper.ts`) que normaliza la paginación (`page`/`pageSize`) y la traducción del objeto `filter` a un `where` de Prisma en los repositorios.
>
> **Añadido**: 2026-08-20 (`260e904`). Usado por `PrismaSystemUserRepository.getUsers()` y `PrismaAiAnalysisRepository.getAiAnalysis()`.

---

## 1. Concepto

Antes del helper, cada repositorio repetía el mismo bloque: calcular `page`/`pageSize`, construir `where` a partir de `filter` con un switch de tipos, ejecutar `count` + `findMany` con `skip`/`take` y armar el `PagedResultDto`.

Con el helper, cada repositorio solo provee:

1. **Closures tipadas** de su propio delegate Prisma (`count` / `findMany`).
2. Un `where` base (ej. `{ deletedAt: null }`).
3. Los `findManyArgs` adicionales (orderBy, include, select, …).
4. La **`filterConfig`**: mapa `campo → spec` que indica cómo convertir cada clave de `filter` a Prisma.

El helper hace el resto: construye el `where` final, calcula `skip`/`take` y ejecuta `count` + `findMany` en paralelo (`Promise.all`).

---

## 2. Cómo funciona la búsqueda por URL (explicación en lenguaje humano)

Cuando el frontend (o cualquier cliente) quiere mostrar una lista —por ejemplo, una tabla de usuarios en la página 3 con 25 filas por página y solo los usuarios cuyo nombre empiece por "John"— **no envía nada especial al servidor**: lo expresa todo en la propia dirección URL, como un pedido que viaja dentro de la barra del navegador.

Imagina que el navegador llama a esto:

```
GET /users?page=3&pageSize=25&filter[firstName]=John
```

Lo que ocurre detrás, paso a paso:

1. **El navegador pide "la página 3, 25 por página, nombre contiene John".** Esos datos viajan como *query params*: `page`, `pageSize` y `filter` (una especie de bolsillo donde caben varios filtros a la vez, uno por clave).

2. **NestJS recoge el pedido en un DTO.** El controlador de usuarios recibe la query y la convierte en un objeto tipado y validado: `page` debe ser un número ≥ 1, `pageSize` un número ≥ 1, y `filter` un objeto con las claves que sean. Si algo no cumple las reglas, la petición se rechaza antes de tocar la base de datos.

3. **El servicio pasa el pedido al repositorio.** El repositorio no sabe (ni le importa) de dónde vino la URL: solo recibe ese objeto con `page`, `pageSize` y `filter`, y se lo entrega al helper `paginatePrisma`.

4. **El helper decide qué campos son válidos y cómo interpretarlos.** El repositorio le dijo de antemano, en su `filterConfig`, qué claves acepta y *de qué tipo es cada una*:
   - `firstName` es texto → el filtro significa *"contiene John"* (búsqueda parcial, no exacta).
   - `isActive` es sí/no → el filtro interpreta `"true"`/`"false"` como verdadero/falso.
   - `id` es número → convierte el texto a número.
   - `status` es un valor cerrado (enum) → busca coincidencia exacta.
   - `role` es especial: necesita una función "traductora" (transformer) porque el rol no es una columna del usuario, sino una relación con otra tabla; la función arma esa condición compuesta por ti.
   
   Cualquier clave que no esté en esa lista se **ignora** (no rompe la petición, simplemente no filtra nada).

5. **Se traduce a un filtro de base de datos.** Todo ese pedido se convierte en una condición SQL equivalente a "WHERE nombre contiene 'John' AND no está borrado" (el filtro base de soft-delete siempre se mantiene, no lo puede "apagar" el cliente).

6. **Se cuenta y se trae solo lo necesario.** El helper hace dos cosas a la vez: cuenta cuántos registros coinciden en total y trae **solo** los 25 de la página 3 (se salta los 50 anteriores). Devolver solo 25 en lugar de todos es lo que hace la app rápida cuando hay miles de registros.

7. **Se responde con la página completa.** El cliente recibe un paquete con los 25 usuarios de esa página **más los metadatos** para pintar la tabla y los controles de paginación: total de registros, página actual, cuántos por página y cuántas páginas hay en total. Con esos datos el frontend sabe si el botón "siguiente" debe estar habilitado o no, sin volver a preguntar.

En resumen: **la URL es el formulario de búsqueda**. Cada `filter[clave]=valor` es un criterio, y `page`/`pageSize` deciden qué trozo de la lista se devuelve. El repositorio solo define qué claves están permitidas y cómo interpretarlas; el resto lo hace el helper de forma uniforme en todos los módulos.

> **Detalle práctico**: los filtros son *acumulativos*. `?filter[firstName]=John&filter[isActive]=true` devuelve los usuarios que cumplen **ambas** condiciones a la vez (no una u otra). Para "o bien… o bien…" no hay soporte aún — ver [Pendientes](#9-pendiente--notas).

---

## 3. Tipos de filtro (`FilterSpec`)

`FilterSpec` es **o bien** un tipo simple (`FilterType`) **o bien** un transformer (función).

| Spec | Tipo | Conversión a `where` | Uso típico |
|------|------|----------------------|------------|
| `'string'` | `FilterType` | `{ contains: value }` | Búsqueda parcial (firstName, lastName, email, employeeId, phoneNumber) |
| `'number'` | `FilterType` | `Number(value)` si no es `NaN` | Igualdad numérica (id) |
| `'boolean'` | `FilterType` | `value === 'true' \|\| value === true` | Flags (isActive) |
| `'enum'` | `FilterType` | `value` tal cual | Igualdad exacta sobre enum (status, analysisType) |
| `(value) => fragment \| null` | `FilterTransformer` | Fragmento de `where` que se mezcla con `Object.assign` | Filtros complejos/relacionales (role → `roles.some`) |

**Reglas del helper** (`buildWhereFromFilters`):

- Solo procesa claves que existen en `filterConfig` (las desconocidas se ignoran).
- Valores `undefined`, `null` o `''` se **ignoran** (no agregan condición).
- El `where` base (ej. `{ deletedAt: null }`) siempre se conserva y se combina con los filtros.

### 2.1 Transformer (filtros relacionales/complejos)

Cuando el filtro no es una columna directa sino una relación (o una condición custom), se usa una función:

```typescript
filterConfig: {
  role: (value) => {
    const normalized = typeof value === 'string' ? value.toUpperCase() : '';
    if (!normalized) return null;               // sin valor → no agrega condición
    return { roles: { some: { role: { name: normalized } } } };
  },
}
```

El transformer recibe el valor crudo del query y devuelve:
- Un fragmento `Record<string, unknown>` → se mezcla en el `where`.
- `null` / `undefined` → se ignora.

---

## 4. Paginación

| Parámetro | Default | Reglas |
|-----------|---------|--------|
| `page` | `1` | `Math.max(Number(page) || 1, 1)` — mínimo 1 |
| `pageSize` | `10` | `Number(pageSize) || 10` |

- `skip = (page - 1) * pageSize`, `take = pageSize`.
- El helper devuelve el `PagedResultDto` estándar:

```typescript
{
  items: T[],
  totalItems: number,          // count con el mismo where
  page: number,
  pageSize: number,
  totalPages: number,          // Math.ceil(totalItems / pageSize)
}
```

---

## 5. Firma del helper

```typescript
paginatePrisma<TWhere, TFindManyArgs, TItem>(args: {
  count: (args: { where: TWhere }) => PromiseLike<number>;
  findMany: (args: TFindManyArgs) => PromiseLike<TItem[]>;
  where: TWhere;                              // where base (ej. soft-delete)
  findManyArgs: Omit<TFindManyArgs, 'where' | 'skip' | 'take'>;
  query: { page?: number; pageSize?: number; filter?: Record<string, unknown> };
  filterConfig?: Record<string, FilterSpec>;
}): Promise<PagedResultDto<TItem>>
```

> Los genéricos suelen ser `Prisma.<Modelo>WhereInput`, `Prisma.<Modelo>FindManyArgs` y el tipo de item del repo (ej. `SystemUserWithRoles`).

---

## 6. Ejemplo completo — `PrismaSystemUserRepository.getUsers()`

```typescript
return paginatePrisma<
  Prisma.SystemUserWhereInput,
  Prisma.SystemUserFindManyArgs,
  SystemUserWithRoles
>({
  count: (args) => this.prisma.systemUser.count(args),
  findMany: (args) =>
    this.prisma.systemUser.findMany(args) as unknown as PromiseLike<SystemUserWithRoles[]>,
  where: { deletedAt: null },                          // base: excluye soft-deleted
  findManyArgs: {
    orderBy: { createdAt: 'desc' },
    include: ROLES_INCLUDE,
  },
  query,
  filterConfig: {
    id: 'number',
    firstName: 'string',
    lastName: 'string',
    employeeId: 'string',
    email: 'string',
    phoneNumber: 'string',
    role: (value) => {                                 // transformer: relación N:N
      const normalized = typeof value === 'string' ? value.toUpperCase() : '';
      if (!normalized) return null;
      return { roles: { some: { role: { name: normalized } } } };
    },
    isActive: 'boolean',
  },
});
```

---

## 7. Cómo se invoca desde el cliente HTTP

El DTO de query debe extender `PaginationQueryDto` (`page`, `pageSize`) y aceptar `filter` como objeto:

```typescript
export class UserQueryParameters extends PaginationQueryDto {
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => value ?? {})
  filter?: Record<string, unknown>;
}
```

**Formato de query params** (`filter[key]=value`):

```
GET /users?page=2&pageSize=20&filter[firstName]=John&filter[isActive]=true
GET /users?filter[role]=admin
GET /ai-analysis?filter[status]=COMPLETED&filter[analysisType]=VALIDATION_REQUEST_ITEM
```

| Ejemplo | Resultado en `where` |
|---------|----------------------|
| `filter[id]=42` | `{ id: 42 }` |
| `filter[firstName]=John` | `{ firstName: { contains: 'John' } }` |
| `filter[isActive]=true` | `{ isActive: true }` |
| `filter[status]=COMPLETED` | `{ status: 'COMPLETED' }` |
| `filter[role]=admin` | `{ roles: { some: { role: { name: 'ADMIN' } } } }` (transformer) |

> La clave `role` del filter **ignora el case del valor** (se normaliza a mayúsculas) porque el transformer compara contra `Role.name` (almacenado en mayúsculas).

---

## 8. Buenas prácticas

1. **Siempre declara un `where` base** (soft-delete, tenant, etc.) — el helper lo conserva y combina.
2. **Nombra las claves de `filterConfig` igual que los campos Prisma** que filtran (para el caso simple).
3. Usa **transformers** solo para filtros relacionales o con lógica propia (normalización, upper/lower, rangos).
4. El transformer debe devolver `null`/`undefined` cuando no hay valor útil, para no contaminar el `where`.
5. Documenta las claves permitidas en el `@ApiProperty` del DTO (el `description` se refleja en Swagger).

---

## 9. Pendiente / notas

- El `filter` actualmente no soporta **operadores** (>=, <=, in, between, fecha-rango, búsqueda insensible a acentos). Si se necesitan, extender `FilterType` con specs más ricos (objeto de operadores) o transformers por campo.
- `NotificationController` aún parsea `page`/`pageSize` manualmente (no usa el helper) — ver [Roadmap](07-roadmap-todo.md) §3.3.

---

> **Documentos relacionados**: [Backend Modules](01-modules.md) §10 (paquetes compartidos), [Business Logic](03-business-logic.md) §2.3, [API & Integrations](04-api-integrations.md) §1.2, [Roadmap](07-roadmap-todo.md).