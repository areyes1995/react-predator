# Frontend - Componentes UI

## 1. Component Organization

```
components/
├── charts/           # Gr\u00e1ficas y visualizaciones
├── home/             # Widgets de home page
├── layout/           # Layout principal (AppLayout)
├── menu/             # Navegaci\u00f3n del men\u00fa
├── records/          # Tablas y vistas de records
├── settings/         # Vistas de configuraci\u00f3n
├── sidebar/          # Sidebar navigation
└── ui/               # Componentes base (button, form, etc.)
```

## 2. Layout Component

```
AppLayout
├── Header
│   ├── UserMenu (dropdown con logout)
│   ├── ThemeToggle
│   └── NotificationBell
├── Sidebar
│   ├── NavigationMenu (dynamic based on permissions)
│   └── UserBadge (current user info)
└── MainContent
    └── Outlet (rendered child routes)
```

## 3. Form Components

| Component        | Props                     | Description         |
|-----------------|--------------------------|---------------------|
| `InputField`    | `name, label, type`      | Controlled input    |
| `SelectField`   | `name, label, options`   | Select dropdown     |
| `TextArea`      | `name, label`            | Multiline textarea  |
| `FormContainer` | `onSubmit, children`     | Form wrapper        |

## 4. Table Components

| Component              | Props                     | Description             |
|-----------------------|--------------------------|-------------------------|
| `RecordsTable`        | `data, columns`          | Dynamic data table      |
| `DataTable`           | `data, columns, filters` | Filtered table          |
| `SortableHeader`      | `sortKey, direction`     | Sortable column header  |
| `Pagination`          | `total, page, onPageChange` | Page controls        |
| `ExportButtons`       | `onExport`               | Export to CSV/Excel     |

## 5. Chart Components

| Component       | Props                     | Description             |
|----------------|--------------------------|-------------------------|
| `LineChart`    | `data, xKey, yKeys`      | Line chart              |
| `BarChart`     | `data, xKey, yKeys`      | Bar chart               |
| `PieChart`     | `data, nameKey, valueKey`| Pie/doughnut chart      |
| `StatCard`     | `title, value, icon`     | Stat card with icon     |

## 6. Icon System

```typescript
import { Bell, User, Home, Settings, Search, Filter, Plus, Edit, Trash } from 'lucide-react';

// Usage
<Home size={20} strokeWidth={1.5} />
```

## 7. Settings Components

| Component             | Props                    | Description         |
|-----------------------|-------------------------|---------------------|
| `SettingsView`        | `data, onUpdate`        | Main settings page  |
| `CreateModuleView`    | `moduleType, onSubmit`  | Module creation form|

## 8. Records Components

| Component                | Props                    | Description             |
|-------------------------|-------------------------|-------------------------|
| `RbacRolesView`          | `view`                  | Role management views   |
| `RbacPermissionsView`    | `view`                  | Permission management   |
| `RecordsSummary`         | `module, records`       | Summary view            |
| `RecordsGrid`            | `module, records`       | Grid layout view        |
| `RecordsTable`           | `module, records`       | Table view              |
| `RecordsForm`            | `module, item`          | CRUD form               |

## 9. Common Props Interface

```typescript
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface TableProps {
  columns: ColumnDef<any>[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}
```
