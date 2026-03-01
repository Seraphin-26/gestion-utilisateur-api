import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Home, Zap } from 'lucide-react'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/4 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8 relative inline-block"
        >
          <span
            className="font-display font-black select-none"
            style={{
              fontSize: 'clamp(80px, 20vw, 160px)',
              background: 'linear-gradient(135deg, var(--accent) 0%, rgba(124,106,255,0.2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            404
          </span>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full rounded-full border border-dashed border-accent/20" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text)' }}>
            {t('notFound.title')}
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            {t('notFound.subtitle')}
          </p>

          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            {t('notFound.home')}
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 flex items-center gap-3 justify-center"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-8 h-px" style={{ background: 'var(--border)' }} />
          <Zap className="w-3 h-3" />
          <div className="w-8 h-px" style={{ background: 'var(--border)' }} />
        </motion.div>
      </div>
    </div>
  )
}
