import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LogIn, Mail, Lock, Zap } from 'lucide-react'
import { useLogin } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'
import { PageTransition } from '../components/layout/PageTransition'

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Requis'),
})
type F = z.infer<typeof schema>

export default function LoginPage() {
  const { t } = useTranslation()
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* bg blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl" />
      </div>

      <PageTransition>
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>UserAPI</span>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-7">
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>Bon retour</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connectez-vous à votre espace</p>
            </div>

            <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
              <div>
                <label className="label">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input {...register('email')} type="email" placeholder="vous@exemple.com" className="input-field pl-10" />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input {...register('password')} type="password" placeholder="••••••••" className="input-field pl-10" />
                </div>
                {errors.password && <p className="error-text">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-accent hover:text-accent-light transition-colors">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <button type="submit" disabled={login.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
                {login.isPending ? <Spinner size="sm" /> : <><LogIn className="w-4 h-4" />{t('auth.login')}</>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-accent hover:text-accent-light font-medium transition-colors">
                  {t('auth.register')}
                </Link>
              </p>
            </div>
          </motion.div>

          <div className="mt-5 flex items-center gap-3 justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="w-10 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-mono">JWT · BCRYPT · PRISMA</span>
            <div className="w-10 h-px" style={{ background: 'var(--border)' }} />
          </div>
        </div>
      </PageTransition>
    </div>
  )
}
