import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PORT: z.string().default('3000'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.string().default('5242880'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variables d\'environnement invalides:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
