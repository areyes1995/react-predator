import { AlertCircle } from 'lucide-react'

export default function ProjectCardError({ message = 'Error al cargar los proyectos. Intente de nuevo.' }: { message?: string }) {
  return (
    <div className="bg-[var(--bg-surface-soft)] border border-red-500/30 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-red-400 max-w-sm">{message}</p>
    </div>
  )
}
