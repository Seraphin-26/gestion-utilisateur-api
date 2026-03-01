import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, Shield, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useListUsers, useUpdateUserRole, useDeleteUser } from '../hooks/useAuth'
import { useAuthStore } from '../store/auth.store'
import { SkeletonRow } from '../components/ui/Skeleton'
import { PageTransition } from '../components/layout/PageTransition'

const ROLES = ['USER', 'MODERATOR', 'ADMIN'] as const
const fmt   = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

export default function AdminPage() {
  const { t } = useTranslation()
  const { user: me } = useAuthStore()
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const [confirm, setConfirm] = useState<number | null>(null)

  const { data, isLoading } = useListUsers(page)
  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()

  const filtered = data?.users?.filter((u: { email: string }) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const roleColor = (role: string) => ({
    ADMIN:     'text-danger bg-danger/10',
    MODERATOR: 'text-warning bg-warning/10',
    USER:      'text-ink-400 bg-ink-800/40',
  }[role] ?? 'text-ink-400')

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>{t('admin.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('admin.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-light rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-display uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{t('admin.total')}</p>
          <p className="font-display font-bold text-2xl text-accent">{data?.total ?? '—'}</p>
        </div>
        <div className="glass-light rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-display uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Pages</p>
          <p className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>{data?.totalPages ?? '—'}</p>
        </div>
      </div>

      {/* Search + table */}
      <motion.div className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('admin.search')}
            className="input-field pl-10"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Email', t('admin.role'), t('admin.verified'), t('admin.joined'), t('admin.actions')].map(h => (
                  <th key={h} className="px-6 pb-3 text-left text-xs font-display uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5}><SkeletonRow /></td></tr>)
                : filtered.length === 0
                  ? <tr><td colSpan={5} className="px-6 py-10 text-center" style={{ color: 'var(--text-muted)' }}>{t('admin.noUsers')}</td></tr>
                  : filtered.map((u: { id: number; email: string; role: string; isEmailVerified: boolean; createdAt: string }) => (
                    <motion.tr
                      key={u.id}
                      className="border-b transition-colors"
                      style={{ borderColor: 'var(--border)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-display font-bold">{u.email[0].toUpperCase()}</span>
                          </div>
                          <span className="font-mono text-xs truncate max-w-[180px]" style={{ color: 'var(--text)' }}>{u.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        {me?.role === 'ADMIN' && u.id !== me?.id ? (
                          <select
                            value={u.role}
                            onChange={e => updateRole.mutate({ id: u.id, role: e.target.value })}
                            className={`text-xs font-display font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${roleColor(u.role)}`}
                            style={{ background: 'transparent' }}
                          >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        ) : (
                          <span className={`text-xs font-display font-semibold px-2 py-1 rounded-lg ${roleColor(u.role)}`}>{u.role}</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        {u.isEmailVerified
                          ? <CheckCircle className="w-4 h-4 text-success" />
                          : <XCircle className="w-4 h-4 text-warning" />
                        }
                      </td>

                      <td className="px-6 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {fmt(u.createdAt)}
                      </td>

                      <td className="px-6 py-3.5">
                        {u.id !== me?.id && me?.role === 'ADMIN' && (
                          <>
                            {confirm === u.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { deleteUser.mutate(u.id); setConfirm(null) }}
                                  className="text-xs text-danger hover:text-danger/80 font-medium transition-colors"
                                >
                                  Confirmer
                                </button>
                                <button onClick={() => setConfirm(null)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirm(u.id)}
                                className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                                title={t('admin.deleteUser')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {data.page} / {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost p-1.5 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-ghost p-1.5 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </PageTransition>
  )
}
