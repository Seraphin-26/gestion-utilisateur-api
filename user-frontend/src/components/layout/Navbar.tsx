import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Zap, LayoutDashboard, User, Shield, LogOut, Sun, Moon, Languages } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { useUIStore } from '../../store/ui.store'
import { useLogout } from '../../hooks/useAuth'
import i18n from '../../i18n'

export function Navbar() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { theme, toggleTheme, lang, setLang } = useUIStore()
  const logout = useLogout()
  const { pathname } = useLocation()

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MODERATOR'

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/profile',   icon: User,            label: t('nav.profile') },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: t('nav.admin') }] : []),
  ]

  const toggleLang = () => {
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    i18n.changeLanguage(next)
  }

  return (
    <header className="sticky top-0 z-50 glass-light border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shadow-md shadow-accent/30">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-base hidden sm:block" style={{ color: 'var(--text)' }}>UserAPI</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium transition-all duration-200 ${
                pathname === to
                  ? 'bg-accent/15 text-accent'
                  : 'hover:bg-ink-800/40'
              }`}
              style={{ color: pathname === to ? undefined : 'var(--text-muted)' }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="btn-ghost flex items-center gap-1.5 text-xs px-2.5 py-1.5"
            title="Toggle language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="font-mono uppercase">{lang}</span>
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-lg" title="Toggle theme">
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          {/* Logout */}
          <button onClick={logout} className="btn-ghost flex items-center gap-1.5 text-sm px-2.5">
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
