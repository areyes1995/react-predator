# UI/UX & Design System — Modu (Frontend)

> **Propósito**: Documentar el sistema de diseño, paleta de colores, tipografía, componentes y patrones de UI.

---

## 1. Principios de Diseño

- **Minimalista**: Interfaces limpias, sin elementos decorativos innecesarios
- **Consistente**: Misma paleta, tipografía y espaciado en toda la app
- **Responsive**: Adaptable a móvil (layout split → single column en < 1024px)
- **Accesible**: Roles ARIA, labels en formularios, contraste suficiente

---

## 2. Paleta de Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#fff` | Fondo general |
| `--color-bg-dark` | `#0a0a0c` | Fondo oscuro (branding) |
| `--color-surface` | `#f9fafb` | Fondo secundario |
| `--color-border` | `#e5e7eb` | Bordes y divisores |
| `--color-border-input` | `#d1d5db` | Bordes de inputs |
| `--color-primary` | `#f2a93b` | Color principal (botones, acentos) |
| `--color-primary-hover` | `#f5b961` | Hover de primary |
| `--color-primary-glow` | `rgba(242,169,59,0.25)` | Sombra de botón primary |
| `--color-primary-glow-hover` | `rgba(242,169,59,0.35)` | Sombra hover |
| `--color-text-primary` | `#111827` | Texto principal |
| `--color-text-secondary` | `#374151` | Texto secundario |
| `--color-text-muted` | `#6b7280` | Texto terciario |
| `--color-text-placeholder` | `#9ca3af` | Placeholder |
| `--color-error-bg` | `#fef2f2` | Fondo de error |
| `--color-error-border` | `#fecaca` | Borde de error |
| `--color-error-text` | `#b91c1c` | Texto de error |
| `--color-role-admin` | `#fef3c7` | Badge rol ADMIN |
| `--color-role-admin-text` | `#b45309` | Texto badge ADMIN |

---

## 3. Tipografía

| Propiedad | Valor |
|-----------|-------|
| **Font family** | `'Inter', system-ui, -apple-system, sans-serif` |
| **Tamaños** | 0.75rem (small), 0.875rem, 0.9375rem (body), 1rem, 1.125rem, 1.25rem, 1.5rem, 2rem, 2.75rem (hero) |
| **Pesos** | 400 (normal), 500 (medium), 600 (semibold), 700 (bold) |

---

## 4. Componentes del Sistema de Diseño

Actualmente todos los estilos están **inline** dentro de cada componente (`<style>{...}</style>`). No hay archivos CSS separados ni Tailwind configurado más allá del global `index.css`.

### 4.1 FormField

```
┌─────────────────────┐
│  Label              │
│  ┌─────────────────┐│
│  │ Input           ││
│  └─────────────────┘│
│  Mensaje de error   │
└─────────────────────┘
```

**Estados**: normal, con error.

### 4.2 FormInput

```
┌─────────────────────┐
│ [icon] placeholder  │
└─────────────────────┘
```

**Estados**: normal, focus (borde `#f2a93b` + box-shadow `rgba(242,169,59,0.15)`), disabled (opacity 0.5).

**Radio de borde**: `0.75rem` (12px)

### 4.3 FormButton

```
┌─────────────────────────┐
│  Sign in          →    │
└─────────────────────────┘
```

**Estados**:
- Normal: gradiente `linear-gradient(135deg, #f2a93b, #f5b961)`, sombra
- Hover: sombra más intensa, translateY(-1px)
- Loading: spinner + texto de carga, deshabilitado
- Disabled: opacity 0.6

**Radio de borde**: `0.75rem`

### 4.4 TextCarousel

Animación de texto rotativo. Cada ítem aparece con:
- `opacity: 0 → 1`
- `transform: translateY(12px) → translateY(0)`
- Duración: 0.5s

### 4.5 Layout Login

```
┌──────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │              │  │  Logo            Sign up  │  │
│  │   Branding   │  │                          │  │
│  │   (oscuro)   │  │   Welcome to Modu        │  │
│  │              │  │   Enter your credentials │  │
│  │   Logo       │  │                          │  │
│  │   Título     │  │   [Error]               │  │
│  │   Carousel   │  │   Email                 │  │
│  │   ● ○ ○     │  │   Password              │  │
│  │              │  │   [Sign in →]           │  │
│  │              │  │   Forgot password?      │  │
│  │              │  │   © Modu  Privacy  Supp │  │
│  └──────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────┘
       < 1024px → single column (branding oculto)
```

### 4.6 Layout Dashboard (3 Columnas)

```
┌───────────────────────────────────────────────────────────────────┐
│  ┌────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
│  │  Sidebar   │  │  Menu Panel   │  │  Main (flex-1)         │  │
│  │  (w-60)    │  │  (w-80↔w-12)  │  │                        │  │
│  │            │  │               │  │                        │  │
│  │  [Quick]   │  │  [SearchBar]  │  │                        │  │
│  │  links     │  │               │  │  {Opción} — {Módulo}   │  │
│  │            │  │  {Vista/módulo}│  │  ┌──────────────────┐  │  │
│  │  Records ▾ │  │  ┌───────────┐│  │  │ RecordsView /    │  │  │
│  │  ▸ 5 mods  │  │  │ Opción   ││  │  │ HomeOverview     │  │  │
│  │            │  │  ├───────────┤│  │  └──────────────────┘  │  │
│  │  Mgmt/Sec  │  │  │ Opción   ││  │                        │  │
│  │            │  │  └───────────┘│  │  (scroll interno)     │  │
│  │            │  │               │  │                        │  │
│  ├────────────┤  └───────────────┘  └────────────────────────┘  │
│  │  Profile   │                                                 │
│  └────────────┘                                                 │
└───────────────────────────────────────────────────────────────────┘
```

- El área principal es un contenedor de **scroll interno** (`flex-1 overflow-auto`): el `main` usa `overflow-hidden` y cada vista (tabla, gráficos) maneja su propio scroll.
- `HomeOverview` (Quick link "Home Page") muestra el **resumen global**: KPIs, "Records by module", status y cards por módulo.

### 4.7 Cards & Charts (`components/charts/`)

Primitivas de gráficos **CSS/Tailwind puro** (sin librerías externas). Todas comparten un hover con **scale-up**:

| Componente | Props | Hover |
|-----------|-------|-------|
| `KpiCard` | `label, value, hint?, suffix?, icon?, accentClass?` | `scale-[1.02]`, fondo y borde más claros |
| `CategoryBarList` | `title, items: {name,count}[], icon?, barClass?` | idem |
| `StatusOverview` | `title, segments[], total, recent?, icon?` | idem |

La animación de hover usa `transition-all duration-300` con `hover:scale-[1.02] hover:bg-[#23252B]/60 hover:border-[#32353E]`.

### 4.8 SidebarDropdown (menú colapsable)

```
┌─────────────────────┐
│ [icon] Records    ▾ │   ← header: clic alterna abrir/cerrar
├─────────────────────┤
│  [icon] Coaching     │
│  [icon] Vacations    │   ← items expandibles
│  [icon] Sales        │
│  [icon] Licenses     │
│  [icon] Permissions  │
└─────────────────────┘
```

- **Chevron** rota 180° con `transition-transform duration-300` cuando está abierto.
- Los items se despliegan con **animación de altura** (`grid-template-rows: 0fr ↔ 1fr`, `duration-300`).
- Iconos de los módulos: **minimalistas, planos y monocromáticos** (`w-4 h-4` sin colores) para una estética profesional.
- El item activo se resalta con la barra de acento `#f2a93b` (heredada de `SidebarLinkItem`).

### 4.9 MenuPanel colapsable (rail) — panel central de vistas (antes NotesListPanel)

```
Expandido (w-80)                  Colapsado (w-12)
┌────────────────┐               ┌──────────┐
│ [Search]   [+] │               │    ▸     │  ← expandir
├────────────────┤               │   [grid] │
│  Records View   │               │  M O D U │
│  ╲ (collapse)   │               │  L E S   │  ← texto vertical
├────────────────┤               └──────────┘
│  All Records    │
│  HR Reports     │
│  Payroll        │
└────────────────┘
```

- **Transición de anchura**: `transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`.
- El contenido desaparece con `opacity` (fade) cuando colapsa.
- Colapsado muestra un rail fino con botón de expandir (`ChevronsRight`), icono grid y el texto vertical "MODULES".
- **Auto-ocultar**: prop `autoHideSeconds` (mín. 3s) oculta el panel automáticamente. Solo la primera vez, salvo `autoHideRepeat=true`.
- El estado es **controlado** desde `Dashboard` (`collapsed` + `onCollapsedChange`): al pulsar un módulo del dropdown, el panel se abre automáticamente.
- Persistencia en `localStorage` (`modu_menu_collapsed`; migra la clave legacy `modu_notes_collapsed`). *(Nota de deuda: `autoHideSeconds`/`search` se exponen como props pero hoy `Dashboard` no los usa.)*

**Colores del Dashboard (Dark Theme)**:

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-app` | `#121316` | Fondo general de la app |
| `--bg-sidebar` | `#16171B` | Fondo del sidebar |
| `--bg-panel` | `#1A1B20` | Fondo del panel de notas |
| `--bg-main` | `#16171B` | Fondo del área principal |
| `--bg-surface` | `#23252B` | Superficies (inputs, cards) |
| `--bg-hover` | `#1F2026` | Hover de items |
| `--border` | `#23252B` | Bordes y divisores |
| `--border-active` | `#32353E` | Borde de item activo |
| `--text-primary` | `#FFFFFF` | Texto principal |
| `--text-secondary` | `#9A9CA5` | Texto secundario |
| `--text-muted` | `#565963` | Texto terciario/placeholders |

### 4.10 Scrollbar personalizado

Scrollbar global en `index.css` con estilo moderno acorde al dark theme:

| Propiedad | Valor |
|-----------|-------|
| **Webkit** | `width/height: 10px`, thumb con gradiente `#3A3D47 → #2C2E36`, borde 2px del color de fondo (efecto flotante), `border-radius: 999px` |
| **Hover thumb** | gradiente `#4A4E5A → #3A3D47` |
| **Active/drag** | gradiente acento `#f2a93b → #d18e2a` |
| **Track** | `#16171B`, `border-radius: 999px` |
| **Firefox** | `scrollbar-width: thin` + `scrollbar-color: #3A3D47 #16171B` |
| **Smooth scroll** | contenedores `overflow-auto/y/x` usan `scroll-behavior: smooth` + `overscroll-behavior: contain` |

### 4.11 Sidebar & UserProfile

- `UserProfile` muestra el avatar como **icono genérico** (`UserRound` de lucide-react) dentro de un círculo `#23252B` cuando no hay `avatarUrl`; si existe, se renderiza la imagen.
- El subtexto bajo el nombre muestra el **primer nombre + email** del payload (`firstName · email`), no solo el email.

---

## 5. Patrón de Estados de UI

Cada componente/página debe manejar estos estados:

| Estado | Visual | Ejemplo |
|--------|--------|---------|
| **Loading** | Spinner + texto | Carga de sesión en AuthContext |
| **Error** | Alerta con fondo rojo | Error de login |
| **Empty** | Mensaje informativo | Dashboard placeholder |
| **Success** | Contenido normal | Formulario completado |
| **Disabled** | Opacidad reducida | Botón durante submit |

---

## 6. Responsive

| Breakpoint | Login | Dashboard |
|------------|-------|-----------|
| > 1024px (`lg+`) | Layout split (form + branding) | 3 columnas estáticas (Sidebar w-60 │ NotesList w-80↔w-12 │ Main) |
| 768–1024px (`md`) | Single column (branding oculto) | 3 columnas (w-60 y w-80 escalan; grids KPI 2 col) |
| < 768px (`sm`/base) | Single column (branding oculto) | **Drawers off-canvas**: top bar con botones "Menú"/"Notas", sidebar y notes panel deslizantes con backdrop |

### 6.1 DashboardLayout responsive

```
Desktop (lg+)                       Mobile (< lg)
┌─────────┬──────────┬───────────┐  ┌───────────────────────┐
│ Sidebar │ Notes    │ Main      │  │ [☰] Modu        [✎]  │  ← top bar
│ (w-60)  │ (w-80↔12)│ (flex-1)  │  ├───────────────────────┤
└─────────┴──────────┴───────────┘  │        Main           │
                                    │   (contenido)         │
  Drawer (al tocar ☰):              │                       │
  ┌──────────────────────────────┐  └───────────────────────┘
  │ [✕] Sidebar (w-60, fixed)    │
  └──────────────────────────────┘  Overlay oscuro + blur al
  Drawer menú (al tocar ✎):         abrir cualquier drawer
  ┌──────────────────────────────┐
  │ MenuPanel (w-80/w-12)        │
  └──────────────────────────────┘
```

- El estado de los drawers vive en `DashboardLayout` (`sidebarOpen`/`menuOpen`), el backdrop cierra ambos.
- `lg:translate-x-0` + `lg:static` anulan el drawer en desktop.

### 6.2 Grids y componentes responsive

| Componente | Clases |
|-----------|--------|
| KPI cards (`RecordsSummary`, `HomeOverview`) | `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` |
| Charts fila | `grid-cols-1 xl:grid-cols-2` |
| Cards por módulo (`HomeOverview`) | `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` |
| `RecordsTable` búsqueda | `flex-col md:flex-row` |
| `RecordsTable` paginación | `flex-col lg:flex-row` + `flex-wrap` |
| `RecordsFilter` dropdown | `w-[80vw] max-w-80` |
| `Breadcrumbs` header | `px-4 lg:px-8`, breadcrumbs `overflow-x-auto scrollbar-none` |
| `RagSearchView` contenedor | `mx-auto max-w-7xl px-6` (búsqueda RAG aprovecha el ancho del área principal; antes `max-w-5xl`) |
| Paddings de vistas | `px-4 lg:px-6` |

---

## 7. Estado de Migración

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Estilos | ✅ **Completado** | Tailwind CSS utility classes en uso |
| Iconos | ✅ **Completado** | `lucide-react` component-based icons |
| Tema | ✅ **Completado** | Dark/Light/System via `ThemeContext` + tokens CSS (`--bg-*`, `--text-*`, `--border-*`) |
| Idioma (i18n) | ✅ **Completado** | `i18next` + `react-i18next`; EN/ES; `useAppTranslation` con `noTranslate` |
| Componentes | 🔄 **En progreso** | Dashboard extraído en ~12 componentes; migrar resto de páginas |
| shadcn/ui | ⏳ **Futuro** | Evaluar cuando se necesiten más componentes complejos (modales, tabs, etc.) |

---

## 8. Temas (Light/Dark) y Diseño por Tokens

- **Contexto**: `ThemeContext` expone `theme` (`light | dark | system`) + `resolvedTheme` + `setTheme`. Persiste en `localStorage` (`modu_theme`) y aplica `data-theme` en `<html>`. `system` sigue `prefers-color-scheme` en tiempo real.
- **Tokens CSS** en `index.css`, definidos en `:root[data-theme='dark']` (default) y `:root[data-theme='light']`:

| Token | Dark | Light |
|-------|------|-------|
| `--bg-app` | `#121316` | `#F3F4F6` |
| `--bg-main` | `#16171B` | `#FFFFFF` |
| `--bg-panel` | `#1A1B20` | `#F9FAFB` |
| `--bg-surface` | `#23252B` | `#E5E7EB` |
| `--bg-hover` | `#1F2026` | `#E5E7EB` |
| `--border` | `#23252B` | `#E5E7EB` |
| `--border-active` | `#32353E` | `#D1D5DB` |
| `--text-primary` | `#FFFFFF` | `#111827` |
| `--text-secondary` | `#9A9CA5` | `#374151` |
| `--text-muted` | `#565963` | `#6B7280` |

- **Uso en componentes**: `bg-[var(--bg-surface)]`, `text-[var(--text-primary)]`, `border-[var(--border)]`, etc. Los acentos de marca (`#f2a93b`) y colores de status (verde/rojo/ámbar) NO cambian entre temas.
- **Opacidad**: Tailwind no aplica `/opacity` a `var()` arbitrarias; para esos casos hay tokens dedicados (`--bg-main-80`, `--bg-panel-80`, `--border-50`, `--text-muted-60`, `--text-primary-80`, `--bg-surface-soft`, `--bg-surface-hover`).
- **Scrollbar y `color-scheme`**: también viven en los tokens y cambian con el tema.

---

## 9. Internacionalización (i18n)

- **Stack**: `i18next` + `react-i18next` + `i18next-browser-languagedetector`. Inicializado en `src/i18n/index.ts`, importado en `App.tsx`.
- **Idiomas**: `src/i18n/locales/en.json` (base) y `es.json`. Los textos NO traducidos caen al inglés (fallback).
- **Persistencia**: `localStorage` (`modu_language`), sincronizado con el detector del navegador.
- **Hook**: `useAppTranslation` (`src/i18n/useAppTranslation.ts`) — envuelve `useTranslation` y añade la opción `noTranslate: true` para **excluir** un texto concreto de la traducción (marcador por componente/texto). Ej.: `t('Nombre Propio', { noTranslate: true })`.
- **Convención de claves**: los textos estáticos de UI se envuelven con `t('Text as key')` usando el propio texto inglés como clave (con capitalización y puntuación exactas). Los textos dinámicos/datos (títulos de registros, valores de columnas, nombres de módulos) NO se traducen.
- **Settings**: la opción **Language** en `SettingsView` permite cambiar idioma en vivo (sub-opciones clicables con check de acento `#f2a93b`).

> **Documentos relacionados**: [Frontend Modules](01-modules-pages.md), [Development Conventions](../09-development-conventions.md)