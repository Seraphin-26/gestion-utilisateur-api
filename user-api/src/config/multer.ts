import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { env } from './env'

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `avatar-${uuidv4()}${ext}`)
  },
})

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Format non supporté. Utilisez JPEG, PNG, WEBP ou GIF.'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(env.MAX_FILE_SIZE) },
})
