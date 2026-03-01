import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import { authLimiter } from '../middleware/rateLimit.middleware'
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validators'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), ctrl.register)
router.post('/login', authLimiter, validate(loginSchema), ctrl.login)
router.post('/refresh', validate(refreshSchema), ctrl.refresh)
router.post('/logout', ctrl.logout)
router.get('/verify-email', ctrl.verifyEmail)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), ctrl.resetPassword)

export default router
