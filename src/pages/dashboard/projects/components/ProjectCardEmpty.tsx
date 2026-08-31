import { FolderOpen } from 'lucide-react'

export default function ProjectCardEmpty({ role }: { role: string }) {
  const messages: Record<string, string> = {
    admin: 'No hay proyectos registrados. Haz clic en "+ New Project" para crear uno.',
    expositor: 'Aún no tienes proyectos. ¡Comienza creando tu primer proyecto!',
    visitor: 'No hay proyectos disponibles en este momento. Vuelve pronto.'
  }

  return (
    <div className="bg-[var(--bg-surface-soft)] border border-[var(--border)] rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center">
        <FolderOpen className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-[var(--text-muted)] max-w-sm">
        {messages[role] || messages.visitor}
      </p>
    </div>
  )
}
