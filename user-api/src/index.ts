import 'dotenv/config'
import './config/env'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { globalLimiter } from './middleware/rateLimit.middleware'
import { httpLogger } from './middleware/logger.middleware'
import { logger } from './utils/logger'
import { swaggerSpec } from './config/swagger'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import { env } from './config/env'

const app = express()

// ─── Sécurité ─────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })) // false pour que Swagger UI fonctionne
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Rate limiting + logs HTTP ─────────────────────────────────────────────────
app.use(globalLimiter)
app.use(httpLogger)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Fichiers statiques (avatars) ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)))

// ─── Documentation Swagger ────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'UserAPI Docs',
  customCss: '.swagger-ui .topbar { background: #7c6aff; }',
}))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api/users', userRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route introuvable' })
})

// ─── Error handler global ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Erreur non gérée', { message: err.message, stack: err.stack })
  res.status(500).json({ message: 'Erreur interne du serveur' })
})

app.listen(env.PORT, () => {
  logger.info(`🚀 Serveur démarré sur http://localhost:${env.PORT}`)
  logger.info(`📚 Documentation Swagger : http://localhost:${env.PORT}/api/docs`)
  logger.info(`🔒 CORS autorisé pour : ${env.CLIENT_URL}`)
})

export default app
