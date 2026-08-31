// ──────────────────────────────────────────────
// Records domain — configuration
// ──────────────────────────────────────────────

import {
  ClipboardList,
  Plane,
  TrendingUp,
  BadgeCheck,
  ShieldCheck,
  LayoutGrid,
  Tent,
  BookOpen,
} from 'lucide-react'
import type { RecordColumn, RecordModule, RecordViewOption } from './types'

/** View options shown in the notes panel for every record module. */
export const MODULE_VIEW_OPTIONS: RecordViewOption[] = [
  { label: 'Summary', slug: 'summary', description: 'Charts and KPIs overview', kind: 'summary' },
  { label: 'Table Grid', slug: 'table', description: 'Records as a table grid', kind: 'table' },
  { label: 'Archived', slug: 'archived', description: 'Archived records', kind: 'archived' },
]

/** View options for Roles (RBAC) — Summary + Archived. */
export const ROLES_VIEW_OPTIONS: RecordViewOption[] = [
  { label: 'Summary', slug: 'summary', description: 'All roles overview', kind: 'summary' },
  { label: 'Archived', slug: 'archived', description: 'Inactive roles', kind: 'archived' },
]

/** View options for Permissions (RBAC) — Summary + Archived. */
export const PERMISSIONS_VIEW_OPTIONS: RecordViewOption[] = [
  { label: 'Summary', slug: 'summary', description: 'All permissions grid', kind: 'summary' },
  { label: 'Archived', slug: 'archived', description: 'Archived permissions', kind: 'archived' },
]

/** View options for RAG Records. */
export const RAG_VIEW_OPTIONS: RecordViewOption[] = [
  { label: 'Overview', slug: 'overview', description: 'RAG search over the vector store', kind: 'summary' },
  { label: 'Upload Document', slug: 'upload', description: 'Add a document to the index', kind: 'upload', permission: 'rag:upload-view' },
]

/** Columns for the generic Records View. */
const recordsViewColumns: RecordColumn[] = [
  { key: 'id', header: 'ID', type: 'text' },
  { key: 'title', header: 'Title', type: 'text' },
  { key: 'category', header: 'Category', type: 'text', chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'lastUpdated', header: 'Last Updated', type: 'date' },
  { key: 'owner', header: 'Owner', type: 'text' },
]

/** Columns for Coaching Forms. */
const coachingColumns: RecordColumn[] = [
  { key: 'id', header: 'Form', type: 'text' },
  { key: 'category', header: 'Category', type: 'text', chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'coach', header: 'Coach', type: 'text' },
  { key: 'sessions', header: 'Sessions', type: 'number' },
]

/** Columns for Vacations. */
const vacationsColumns: RecordColumn[] = [
  { key: 'id', header: 'Request', type: 'text' },
  { key: 'leaveType', header: 'Leave Type', type: 'select', options: ['Summer', 'Short Leave', 'Medical', 'Holiday'], chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'days', header: 'Days', type: 'number' },
  { key: 'employee', header: 'Employee', type: 'text' },
]

/** Columns for Sales. */
const salesColumns: RecordColumn[] = [
  { key: 'id', header: 'Deal', type: 'text' },
  { key: 'stage', header: 'Stage', type: 'select', options: ['Pipeline', 'Deals', 'Renewals', 'Campaigns', 'Referrals'], chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'amount', header: 'Amount', type: 'number' },
  { key: 'owner', header: 'Owner', type: 'text' },
]

/** Columns for Licenses. */
const licensesColumns: RecordColumn[] = [
  { key: 'id', header: 'License', type: 'text' },
  { key: 'vendor', header: 'Vendor', type: 'select', options: ['Microsoft', 'Adobe', 'JetBrains', 'Sentinel', 'Norton'], chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'seats', header: 'Seats', type: 'number' },
  { key: 'owner', header: 'Owner', type: 'text' },
]

/** Columns for Permissions. */
const permissionsColumns: RecordColumn[] = [
  { key: 'id', header: 'Permission', type: 'text' },
  { key: 'scope', header: 'Scope', type: 'select', options: ['Admin', 'Finance', 'API', 'HR', 'Infra', 'Roles', 'Audit'], chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'role', header: 'Role', type: 'text' },
  { key: 'owner', header: 'Owner', type: 'text' },
]

/** Columns for Stands. */
const standsColumns: RecordColumn[] = [
  { key: 'id', header: 'Stand', type: 'text' },
  { key: 'category', header: 'Category', type: 'text', chartGroup: true },
  { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Pending', 'Archived'] },
  { key: 'owner', header: 'Owner', type: 'text' },
]

/** The record modules rendered in the sidebar dropdown + notes panel. */
export const RECORD_MODULES: RecordModule[] = [
  { label: 'Records View', slug: 'records', color: 'blue', icon: <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />, viewOptions: RAG_VIEW_OPTIONS, columns: recordsViewColumns },
  { label: 'Coaching Forms', slug: 'coaching', color: 'purple', icon: <ClipboardList className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: coachingColumns },
  { label: 'Vacations', slug: 'vacations', color: 'green', icon: <Plane className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: vacationsColumns },
  { label: 'Sales', slug: 'sales', color: 'amber', icon: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: salesColumns },
  { label: 'Licenses', slug: 'licenses', color: 'blue', icon: <BadgeCheck className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: licensesColumns },
  { label: 'Permissions', slug: 'permissions', color: 'pink', icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: permissionsColumns },
  { label: 'Projects', slug: 'projects', color: 'blue', icon: <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: recordsViewColumns },
  { label: 'Stands', slug: 'stands', color: 'cyan', icon: <Tent className="w-4 h-4" strokeWidth={1.5} />, viewOptions: MODULE_VIEW_OPTIONS, columns: standsColumns },
  { label: 'Knowledge Base', slug: 'knowledge-base', color: 'amber', icon: <BookOpen className="w-4 h-4" strokeWidth={1.5} />, viewOptions: [
    { label: 'Overview', slug: 'overview', description: 'Documents and vector store overview', kind: 'summary' },
    { label: 'Upload', slug: 'upload', description: 'Upload documents to the index', kind: 'upload' },
    { label: 'Direct Knowledge', slug: 'faq', description: 'Manual FAQs and quick knowledge', kind: 'table' },
  ], columns: [] },
]

/** Generic menu used for the Home overview (single view). */
export const GENERAL_MENU: RecordViewOption[] = [
  { label: 'Overview', slug: 'overview', description: 'Global dashboard overview', kind: 'summary' },
]

/** localStorage keys used by the dashboard. */
export const STORAGE_KEYS = {
  activeView: 'modu_active_view',
  selectedCard: 'modu_selected_card',
  menuCollapsed: 'modu_menu_collapsed',
} as const
