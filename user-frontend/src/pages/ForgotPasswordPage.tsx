import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft, Send, Zap } from 'lucide-react'
import { useForgotPassword } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'
import { PageTransition } from '../components/layout/PageTransition'

const schema = z.object({ email: z.string().email('Email invalide') })
type F = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const forgot = useForgotPassword()
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <PageTransition>
        <div className="w-full max-w-md">
          <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>UserAPI</span>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-7">
              <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>{t('auth.forgotTitle')}</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('auth.forgotDesc')}</p>
            </div>

            <form onSubmit={handleSubmit(d => forgot.mutate(d.email))} className="space-y-4">
              <div>
                <label className="label">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input {...register('email')} type="email" placeholder="vous@exemple.com" className="input-field pl-10" />
                </div>
                {errors.email && <p className="error-text">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={forgot.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
                {forgot.isPending ? <Spinner size="sm" /> : <><Send className="w-4 h-4" />{t('auth.sendLink')}</>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <Link to="/login" className="flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backToLogin')}
              </Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </div>
  )
}
