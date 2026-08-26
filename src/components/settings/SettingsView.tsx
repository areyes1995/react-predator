// ──────────────────────────────────────────────
// SettingsView — Settings as a main-area view.
// Each option expands to reveal related sub-options.
// ──────────────────────────────────────────────

import { useState } from 'react'
import {
  Palette,
  Bell,
  Globe,
  Shield,
  User,
  SlidersHorizontal,
  ChevronRight,
  Check,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Expandable, SectionTitle } from '../ui'
import { useTheme, type Theme } from '../../context/ThemeContext'
import { useAppTranslation, type AppTFunction } from '../../i18n/useAppTranslation'
import { changeLanguage, SUPPORTED_LANGUAGES } from '../../i18n'

export interface SettingsOption {
  icon: ReactNode
  label: string
  value?: string
  subOptions?: { label: string; value?: string; description?: string }[]
}

export interface SettingsSection {
  title: string
  options: SettingsOption[]
}

const sections: SettingsSection[] = [
  {
    title: 'settings.section.appearance',
    options: [
      {
        icon: <Palette className="w-4 h-4" />,
        label: 'settings.theme',
        subOptions: [
          { label: 'settings.theme.light' },
          { label: 'settings.theme.dark' },
          { label: 'settings.theme.system' },
        ],
      },
      {
        icon: <Globe className="w-4 h-4" />,
        label: 'settings.language',
        subOptions: SUPPORTED_LANGUAGES.map(lang => ({
          label: lang.labelKey,
          value: lang.code,
        })),
      },
      {
        icon: <SlidersHorizontal className="w-4 h-4" />,
        label: 'settings.density',
        value: 'settings.density.comfortable',
        subOptions: [
          { label: 'settings.density.compact' },
          { label: 'settings.density.comfortable' },
        ],
      },
    ],
  },
  {
    title: 'settings.section.account',
    options: [
      {
        icon: <User className="w-4 h-4" />,
        label: 'settings.profile',
        subOptions: [
          { label: 'settings.profile.name', description: 'settings.profile.name.desc' },
          { label: 'settings.profile.email', description: 'settings.profile.email.desc' },
          { label: 'settings.profile.avatar', description: 'settings.profile.avatar.desc' },
        ],
      },
      {
        icon: <Bell className="w-4 h-4" />,
        label: 'settings.notifications',
        subOptions: [
          { label: 'settings.notifications.email' },
          { label: 'settings.notifications.push' },
          { label: 'settings.notifications.inapp' },
        ],
      },
      {
        icon: <Shield className="w-4 h-4" />,
        label: 'settings.privacy',
        subOptions: [
          { label: 'settings.privacy.sessions', description: 'settings.privacy.sessions.desc' },
          { label: 'settings.privacy.data', description: 'settings.privacy.data.desc' },
        ],
      },
    ],
  },
  {
    title: 'settings.section.workspace',
    options: [
      {
        icon: <SlidersHorizontal className="w-4 h-4" />,
        label: 'settings.preferences',
        subOptions: [
          { label: 'settings.preferences.defaultView' },
          { label: 'settings.preferences.defaultModule' },
        ],
      },
      {
        icon: <Palette className="w-4 h-4" />,
        label: 'settings.colors',
        subOptions: [
          { label: 'settings.colors.accent' },
          { label: 'settings.colors.module', description: 'settings.colors.module.desc' },
        ],
      },
    ],
  },
]

export default function SettingsView() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useAppTranslation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto px-4 lg:px-8 py-6">
        <div className="space-y-8">
          {sections.map(section => (
            <SettingsSectionView
              key={section.title}
              section={section}
              openKey={openKey}
              onToggle={key => setOpenKey(key === openKey ? null : key)}
              theme={theme}
              onThemeChange={setTheme}
              language={i18n.language}
              onLanguageChange={changeLanguage}
              t={t}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsSectionView({
  section,
  openKey,
  onToggle,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  t,
}: {
  section: SettingsSection
  openKey: string | null
  onToggle: (key: string) => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
  language: string
  onLanguageChange: (lang: string) => void
  t: AppTFunction
}) {
  const themeLabel = t(`settings.theme.${theme}`)
  return (
    <section>
      <SectionTitle className="mb-2">{t(section.title)}</SectionTitle>
      <ul className="divide-y divide-[var(--border)]">
        {section.options.map(opt => {
          const key = `${section.title}.${opt.label}`
          const isOpen = openKey === key
          const displayValue =
            opt.label === 'settings.theme'
              ? themeLabel
              : opt.label === 'settings.language'
                ? (SUPPORTED_LANGUAGES.find(l => l.code === language)?.labelKey ?? language)
                : opt.value
                  ? t(opt.value)
                  : ''
          const isSelected = (sub: { label: string; value?: string }) =>
            opt.label === 'settings.theme'
              ? sub.label === `settings.theme.${theme}`
              : opt.label === 'settings.language'
                ? sub.value === language
                : sub.value !== undefined && sub.value === opt.value
          return (
            <li key={opt.label}>
              <button
                className="w-full flex items-center justify-between gap-3 py-3 cursor-pointer group text-left"
                onClick={() => onToggle(key)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition shrink-0">{opt.icon}</span>
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition">{t(opt.label)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {displayValue && <span className="text-xs text-[var(--text-muted)]">{displayValue}</span>}
                  <ChevronRight
                    className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              <Expandable open={isOpen}>
                <ul className="pl-8 pr-2 space-y-0.5 pt-1 pb-3">
                  {opt.subOptions?.map(sub => {
                    const selected = isSelected(sub)
                    return (
                      <li
                        key={sub.value ?? sub.label}
                        onClick={() => {
                          if (opt.label === 'settings.theme') onThemeChange(sub.label.replace('settings.theme.', '') as Theme)
                          if (opt.label === 'settings.language') onLanguageChange(sub.value!)
                          onToggle(key)
                        }}
                        className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-[var(--bg-surface-hover)] cursor-pointer transition"
                      >
                        <div className="min-w-0">
                          <span className="text-sm text-[var(--text-secondary)]">{t(sub.label)}</span>
                          {sub.description && (
                            <p className="text-xs text-[var(--text-muted)] truncate">{t(sub.description)}</p>
                          )}
                        </div>
                        {selected && (
                          <Check className="w-3.5 h-3.5 text-[#f2a93b] shrink-0" />
                        )}
                      </li>
                    )
                  })}
                  {(!opt.subOptions || opt.subOptions.length === 0) && (
                    <li className="py-2 px-2 text-xs text-[var(--text-muted)]">{t('settings.noOptions')}</li>
                  )}
                </ul>
              </Expandable>
            </li>
          )
        })}
      </ul>
    </section>
  )
}