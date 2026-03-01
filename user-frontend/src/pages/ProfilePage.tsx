import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Upload, Trash2, Camera, User } from 'lucide-react'
import { useMe, useUpdateProfile, useChangePassword, useUploadAvatar, useDeleteAccount } from '../hooks/useAuth'
import { SkeletonCard } from '../components/ui/Skeleton'
import { Spinner } from '../components/ui/Spinner'
import { PageTransition } from '../components/layout/PageTransition'
import { useAuthStore } from '../store/auth.store'

const profileSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName:  z.string().max(50).optional(),
  email:     z.string().email('Email invalide'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requis'),
  newPassword: z.string().min(8, 'Min 8 car.').regex(/[A-Z]/, 'Une majuscule').regex(/[0-9]/, 'Un chiffre'),
})

const deleteSchema = z.object({ password: z.string().min(1, 'Requis') })

type ProfileF  = z.infer<typeof profileSchema>
type PasswordF = z.infer<typeof passwordSchema>
type DeleteF   = z.infer<typeof deleteSchema>

const ROLE_STYLES: Record<string, string> = {
  ADMIN:     'bg-danger/10 text-danger border border-danger/20',
  MODERATOR: 'bg-warning/10 text-warning border border-warning/20',
  USER:      'bg-accent/10 text-accent border border-accent/20',
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { data: me, isLoading } = useMe()
  const { user } = useAuthStore()
  const updateProfile  = useUpdateProfile()
  const changePassword = useChangePassword()
  const uploadAvatar   = useUploadAvatar()
  const deleteAccount  = useDeleteAccount()
  const fileRef        = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)

  const profileForm  = useForm<ProfileF>({ resolver: zodResolver(profileSchema) })
  const passwordForm = useForm<PasswordF>({ resolver: zodResolver(passwordSchema) })
  const deleteForm   = useForm<DeleteF>({ resolver: zodResolver(deleteSchema) })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadAvatar.mutate(file)
  }

  const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
  const item    = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

  // Nom affiché
  const displayName = me
    ? [me.firstName, me.lastName].filter(Boolean).join(' ') || me.email
    : '—'

  if (isLoading) return <PageTransition><SkeletonCard /></PageTransition>

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text)' }}>{t('profile.title')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('profile.subtitle')}</p>
      </div>

      <motion.div className="space-y-6 max-w-2xl" variants={stagger} initial="initial" animate="animate">

        {/* Avatar + Identité */}
        <motion.div variants={item} className="card">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {me?.avatar ? (
                <img src={me.avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20">
                  <span className="font-display font-bold text-white text-3xl">
                    {(me?.firstName?.[0] || me?.email[0] || '?').toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-md hover:bg-accent-dark transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-xl truncate" style={{ color: 'var(--text)' }}>{displayName}</p>
              <p className="text-sm truncate mb-2" style={{ color: 'var(--text-muted)' }}>{me?.email}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badge rôle */}
                <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-lg ${ROLE_STYLES[user?.role ?? 'USER']}`}>
                  {user?.role}
                </span>
                {/* Badge email vérifié */}
                {me?.isEmailVerified
                  ? <span className="text-xs px-2.5 py-1 rounded-lg bg-success/10 text-success border border-success/20 font-display font-semibold">✓ Vérifié</span>
                  : <span className="text-xs px-2.5 py-1 rounded-lg bg-warning/10 text-warning border border-warning/20 font-display font-semibold">⚠ Non vérifié</span>
                }
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="btn-ghost flex items-center gap-2 text-sm border"
              style={{ borderColor: 'var(--border)' }}
            >
              {uploadAvatar.isPending ? <Spinner size="sm" /> : <Upload className="w-4 h-4" />}
              {t('profile.uploadAvatar')}
            </button>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPEG, PNG, WEBP — max 5 MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </motion.div>

        {/* Informations personnelles */}
        <motion.div variants={item} className="card">
          <h2 className="font-display font-semibold mb-5" style={{ color: 'var(--text)' }}>Informations personnelles</h2>
          <form
            onSubmit={profileForm.handleSubmit(d => updateProfile.mutate(d))}
            className="space-y-4"
          >
            {/* Nom / Prénom */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom <span className="text-xs opacity-50">(optionnel)</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    {...profileForm.register('firstName')}
                    type="text"
                    placeholder="Jean"
                    defaultValue={me?.firstName ?? ''}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label">Nom <span className="text-xs opacity-50">(optionnel)</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    {...profileForm.register('lastName')}
                    type="text"
                    placeholder="Dupont"
                    defaultValue={me?.lastName ?? ''}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  {...profileForm.register('email')}
                  type="email"
                  defaultValue={me?.email}
                  className="input-field pl-10"
                />
              </div>
              {profileForm.formState.errors.email && (
                <p className="error-text">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            <button type="submit" disabled={updateProfile.isPending} className="btn-primary flex items-center gap-2">
              {updateProfile.isPending ? <Spinner size="sm" /> : t('common.save')}
            </button>
          </form>
        </motion.div>

        {/* Changer mot de passe */}
        <motion.div variants={item} className="card">
          <h2 className="font-display font-semibold mb-5" style={{ color: 'var(--text)' }}>{t('profile.changePassword')}</h2>
          <form onSubmit={passwordForm.handleSubmit(d => changePassword.mutate(d))} className="space-y-4">
            {[
              { name: 'currentPassword' as const, label: t('profile.currentPassword') },
              { name: 'newPassword' as const,     label: t('profile.newPassword') },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <input {...passwordForm.register(name)} type="password" placeholder="••••••••" className="input-field pl-10" />
                </div>
                {passwordForm.formState.errors[name] && (
                  <p className="error-text">{passwordForm.formState.errors[name]?.message}</p>
                )}
              </div>
            ))}
            <button type="submit" disabled={changePassword.isPending} className="btn-primary flex items-center gap-2">
              {changePassword.isPending ? <Spinner size="sm" /> : t('common.save')}
            </button>
          </form>
        </motion.div>

        {/* Supprimer le compte */}
        <motion.div variants={item} className="card border border-danger/20">
          <h2 className="font-display font-semibold mb-1 text-danger">{t('profile.deleteAccount')}</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{t('profile.deleteWarning')}</p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" />{t('profile.deleteAccount')}
            </button>
          ) : (
            <form onSubmit={deleteForm.handleSubmit(d => deleteAccount.mutate(d.password))} className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input {...deleteForm.register('password')} type="password" placeholder="Votre mot de passe" className="input-field pl-10" />
              </div>
              {deleteForm.formState.errors.password && <p className="error-text">{deleteForm.formState.errors.password.message}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={deleteAccount.isPending} className="btn-danger flex items-center gap-2">
                  {deleteAccount.isPending ? <Spinner size="sm" /> : <><Trash2 className="w-4 h-4" />{t('common.confirm')}</>}
                </button>
                <button type="button" onClick={() => setShowDelete(false)} className="btn-ghost border" style={{ borderColor: 'var(--border)' }}>
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}
        </motion.div>

      </motion.div>
    </PageTransition>
  )
}