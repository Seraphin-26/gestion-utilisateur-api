import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { UserPlus, Mail, Lock, Zap } from 'lucide-react'
import { useRegister } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'
import { PageTransition } from '../components/layout/PageTransition'

const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
  confirm:  z.string(),
}).refine(d => d.password === d.confirm, { message: 'Mots de passe différents', path: ['confirm'] })
type F = z.infer<typeof schema>

export default function RegisterPage() {
  const { t } = useTranslation()
  const reg = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-accent/4 rounded-full blur-3xl" />
      </div>

      <PageTransition>
        <div className="w-full max-w-md">
          <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>UserAPI</span>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-7">
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>Créer un compte</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Rejoignez la plateforme</p>
            </div>

            <form onSubmit={handleSubmit(d => reg.mutate({ email: d.email, password: d.password }))} className="space-y-4">
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

              <div>
                <label className="label">{t('auth.confirmPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input {...register('confirm')} type="password" placeholder="••••••••" className="input-field pl-10" />
                </div>
                {errors.confirm && <p className="error-text">{errors.confirm.message}</p>}
              </div>

              <button type="submit" disabled={reg.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
                {reg.isPending ? <Spinner size="sm" /> : <><UserPlus className="w-4 h-4" />{t('auth.register')}</>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-accent hover:text-accent-light font-medium transition-colors">{t('auth.login')}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </div>
  )
}
