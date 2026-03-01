import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  userId?: number
  userRole?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token manquant ou invalide' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyAccessToken(token)
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch {
    res.status(401).json({ message: 'Token expiré ou invalide' })
  }
}

// Middleware de vérification de rôle
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ message: 'Accès refusé : permissions insuffisantes' })
      return
    }
    next()
  }
}
