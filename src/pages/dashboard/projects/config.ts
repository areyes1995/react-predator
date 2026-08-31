import { PROJECTS_DATA } from './data'

export const PROJECT_MODULE_DATA = PROJECTS_DATA.map((p: { id: string; title: string; category: string; status: string; updatedAt: string; author: string }) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  status: p.status === 'active' ? 'Active' as const : p.status === 'pending' ? 'Pending' as const : p.status === 'completed' ? 'Active' as const : 'Archived' as const,
  lastUpdated: p.updatedAt,
  owner: p.author
}))
