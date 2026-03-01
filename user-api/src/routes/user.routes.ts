import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { uploadLimiter } from '../middleware/rateLimit.middleware'
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.validators'
import { z } from 'zod'

const router = Router()

// Routes protégées (utilisateur connecté)
router.get('/me', authMiddleware, ctrl.getMe)
router.put('/me', authMiddleware, validate(updateProfileSchema), ctrl.updateProfile)
router.put('/me/password', authMiddleware, validate(changePasswordSchema), ctrl.changePassword)
router.post('/me/avatar', authMiddleware, uploadLimiter, ...(ctrl.uploadAvatar as any[]))
router.delete('/me', authMiddleware, validate(z.object({ password: z.string().min(1) })), ctrl.deleteAccount)

// Routes admin
router.get('/', authMiddleware, requireRole('ADMIN', 'MODERATOR'), ctrl.listUsers)
router.put('/:id/role', authMiddleware, requireRole('ADMIN'), validate(z.object({ role: z.enum(['USER', 'MODERATOR', 'ADMIN']) })), ctrl.updateUserRole)
router.delete('/:id', authMiddleware, requireRole('ADMIN'), ctrl.adminDeleteUser)

export default router
