// ──────────────────────────────────────────────
// Sidebar — Left navigation panel
// ──────────────────────────────────────────────

import SidebarSection, { type SidebarSectionProps } from './SidebarSection'
import UserProfile, { type UserProfileProps } from './UserProfile'

export interface SidebarProps {
  sections: SidebarSectionProps[]
  user: UserProfileProps
  onLogout?: () => void
  onSettings?: () => void
}

export default function Sidebar({ sections, user, onLogout, onSettings }: SidebarProps) {
  return (
    <aside className="w-60 h-full bg-[var(--bg-main)] border-r border-[var(--border)] flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-6 overflow-y-auto pr-1">
        {sections.map((section, idx) => (
          <SidebarSection key={idx} title={section.title} items={section.items} dropdown={section.dropdown} />
        ))}
      </div>
      <UserProfile name={user.name} subtitle={user.subtitle} avatarUrl={user.avatarUrl} status={user.status} onLogout={onLogout} onSettings={onSettings} />
    </aside>
  )
}