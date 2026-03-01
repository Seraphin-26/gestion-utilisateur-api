import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  firstName: z.string().max(50).optional(),
  lastName:  z.string().max(50).optional(),
})

export const loginSchema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requis'),
})

export const updateProfileSchema = z.object({
  email:     z.string().email('Email invalide').optional(),
  firstName: z.string().max(50).optional().nullable(),
  lastName:  z.string().max(50).optional().nullable(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
})