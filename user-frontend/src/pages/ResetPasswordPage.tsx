import React, { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, Zap, CheckCircle } from 'lucide-react'
import { Spinner } from '../components/ui/Spinner'
import api from '../services/api'
import toast from 'react-hot-toast'

const schema = z.object({
  newPassword: z.string().min(8, 'Min 8 caractères').regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
  confirm: z.string(),
}).refine(d => d.newPassword === d.confirm, { message: 'Mots de passe différents', path: ['confirm'] })

type F = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: F) => {
    const token = params.get('token')
    if (!token) { toast.error('Token manquant'); return }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword: data.newPassword })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? 'Token invalide ou expiré')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>UserAPI</span>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

          {success ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle className="w-14 h-14 text-success" />
              </motion.div>
              <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Mot de passe réinitialisé !</h1>
              <p style={{ color: 'var(--text-muted)' }}>Vous allez être redirigé vers la connexion...</p>
              <Link to="/login" className="btn-primary mt-2">Se connecter maintenant</Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text)' }}>Nouveau mot de passe</h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choisissez un mot de passe sécurisé</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input {...register('newPassword')} type="password" placeholder="••••••••" className="input-field pl-10" />
                  </div>
                  {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="label">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input {...register('confirm')} type="password" placeholder="••••••••" className="input-field pl-10" />
                  </div>
                  {errors.confirm && <p className="error-text">{errors.confirm.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Spinner size="sm" /> : 'Réinitialiser le mot de passe'}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link to="/login" className="text-sm text-accent hover:text-accent-light transition-colors">
                  ← Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}