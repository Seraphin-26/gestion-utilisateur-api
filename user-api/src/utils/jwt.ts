import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export const generateAccessToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: number; role: string }
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: number }
}
