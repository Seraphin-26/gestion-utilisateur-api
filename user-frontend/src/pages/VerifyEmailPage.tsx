import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader, Zap } from 'lucide-react'
import api from '../services/api'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setMessage('Token manquant'); return }

    api.get(`/auth/verify-email?token=${token}`)
      .then(r => { setStatus('success'); setMessage(r.data.message) })
      .catch(e => { setStatus('error'); setMessage(e.response?.data?.message ?? 'Token invalide ou expiré') })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md text-center">
        <motion.div className="flex items-center gap-3 mb-8 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>UserAPI</span>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {status === 'loading' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <Loader className="w-10 h-10 text-accent animate-spin" />
              <p style={{ color: 'var(--text-muted)' }}>Vérification en cours...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle className="w-14 h-14 text-success" />
              </motion.div>
              <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Email vérifié !</h1>
              <p style={{ color: 'var(--text-muted)' }}>{message}</p>
              <Link to="/login" className="btn-primary mt-2">Se connecter</Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <XCircle className="w-14 h-14 text-danger" />
              </motion.div>
              <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>Échec de la vérification</h1>
              <p style={{ color: 'var(--text-muted)' }}>{message}</p>
              <Link to="/login" className="btn-primary mt-2">Retour à la connexion</Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}