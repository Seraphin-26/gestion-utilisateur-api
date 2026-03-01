import rateLimit from 'express-rate-limit'
import { RequestHandler } from 'express'

// En mode test on désactive complètement le rate limiting
// pour ne pas bloquer les tests qui font beaucoup de requêtes
const isTest = process.env.NODE_ENV === 'test'
const bypass: RequestHandler = (_req, _res, next) => next()

export const authLimiter = isTest ? bypass : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const uploadLimiter = isTest ? bypass : rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: 'Trop d\'uploads. Réessayez dans 1 heure.' },
})

export const globalLimiter = isTest ? bypass : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Trop de requêtes. Réessayez plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
})