import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  // Log à la fin de la requête
  res.on('finish', () => {
    const duration = Date.now() - start
    const level    = res.statusCode >= 500 ? 'error'
                   : res.statusCode >= 400 ? 'warn'
                   : 'info'

    logger[level](`${req.method} ${req.originalUrl}`, {
      status:     res.statusCode,
      duration:   `${duration}ms`,
      ip:         req.ip,
      userAgent:  req.headers['user-agent'],
    })
  })

  next()
}
