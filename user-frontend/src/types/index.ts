export interface User {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  avatar?: string | null
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  role: 'USER' | 'MODERATOR' | 'ADMIN'
  isEmailVerified: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface RegisterResponse {
  message: string
  user: { id: number; email: string }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export type Theme = 'dark' | 'light'
export type Lang  = 'fr' | 'en'