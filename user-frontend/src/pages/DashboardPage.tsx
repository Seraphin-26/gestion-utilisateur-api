import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Shield, Hash, User, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useMe } from '../hooks/useAuth'
import { useAuthStore } from '../store/auth.store'
import { SkeletonCard, SkeletonStats } from '../components/ui/Skeleton'
import { PageTransition } from '../components/layout/PageTransition'

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const item    = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { data: me, isLoading } = useMe()

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>{t('dashboard.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <SkeletonStats />
          <SkeletonCard />
        </div>
      ) : (
        <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
          {/* Stats */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Shield, label: t('dashboard.status'), value: t('dashboard.authenticated'), color: 'text-success' },
              { icon: Hash,   label: t('dashboard.userId'), value: `#${user?.id ?? '—'}`,        color: 'text-accent' },
              { icon: User,   label: t('dashboard.role'),   value: user?.role ?? '—',             color: 'var(--text)' },
              { icon: Clock,  label: t('dashboard.session'),value: t('dashboard.active'),         color: 'var(--text)' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-light rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs font-display uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
                <p className={`font-display font-semibold text-base ${color}`} style={typeof color === 'string' && color.startsWith('var') ? { color } : {}}>{value}</p>
              </div>
            ))}
          </motion.div>

          {/* Profile card */}
          {me && (
            <motion.div variants={item} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {me.avatar ? (
                    <img src={me.avatar} alt="avatar" className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20">
                      <span className="font-display font-bold text-white text-xl">{me.email[0].toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-semibold text-lg truncate" style={{ color: 'var(--text)' }}>{me.email}</p>
                    {me.isEmailVerified
                      ? <span className="flex items-center gap-1 text-xs text-success"><CheckCircle className="w-3 h-3" />{t('profile.emailVerified')}</span>
                      : <span className="flex items-center gap-1 text-xs text-warning"><XCircle className="w-3 h-3" />{t('profile.emailNotVerified')}</span>
                    }
                  </div>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>ID: {me.id}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      { label: t('dashboard.createdAt'), value: fmt(me.createdAt) },
                      { label: t('dashboard.lastUpdate'), value: fmt(me.updatedAt) },
                    ].map(({ label, value }) => (
                      <div key={label} className="glass-light rounded-xl p-3" style={{ borderColor: 'var(--border)' }}>
                        <p className="text-xs font-display uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                        <p className="text-sm" style={{ color: 'var(--text)' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Token */}
          <motion.div variants={item}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-ink-600 rounded-full" />
              <h2 className="font-display font-semibold" style={{ color: 'var(--text)' }}>{t('dashboard.jwtToken')}</h2>
            </div>
            <div className="glass-light rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{t('dashboard.bearerToken')}</p>
              <p className="font-mono text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {localStorage.getItem('token') ?? 'Aucun token'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PageTransition>
  )
}
