// ──────────────────────────────────────────────
// MetaverseButton — Top of sidebar
// ──────────────────────────────────────────────

import { Globe } from 'lucide-react'
import { useAppTranslation } from '../../i18n/useAppTranslation'

export default function MetaverseButton() {
  const { t } = useAppTranslation()

  return (
    <button className="w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#f2a93b] rounded-none relative overflow-hidden hover:bg-[#e2992b] transition-colors duration-300">
      <Globe className="w-4 h-4 relative z-10" />
      {t('metaverse.go')}
    </button>
  )
}
