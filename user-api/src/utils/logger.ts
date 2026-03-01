import { createLogger, format, transports } from 'winston'
import path from 'path'
import fs from 'fs'

// Créer le dossier logs si nécessaire
const logDir = 'logs'
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

const { combine, timestamp, colorize, printf, json, errors } = format

// Format lisible pour le terminal
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n  ${JSON.stringify(meta)}` : ''
  return `${timestamp} [${level}] ${stack || message}${metaStr}`
})

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),

  transports: [
    // Terminal : colorisé et lisible
    new transports.Console({
      format: combine(colorize({ all: true }), consoleFormat),
    }),

    // Fichier : JSON structuré (tous les logs)
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      format: combine(json()),
      maxsize: 10 * 1024 * 1024, // 10 MB max
      maxFiles: 5,
    }),

    // Fichier dédié aux erreurs
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: combine(json()),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],

  // Ne pas crasher si Winston a une erreur interne
  exitOnError: false,
})

// En test, on désactive les logs pour ne pas polluer la sortie Jest
if (process.env.NODE_ENV === 'test') {
  logger.silent = true
}
