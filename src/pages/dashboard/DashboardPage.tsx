// ──────────────────────────────────────────────
// DashboardPage — Main dashboard page
// Shows the projects overview and links to other
// dashboard sections
// ──────────────────────────────────────────────

import ProjectsView from './projects/components/ProjectsView'

export default function DashboardPage() {
  const role = 'expositor' as const
  return <ProjectsView role={role} />
}
