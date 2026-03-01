import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types'

interface AuthState {
  accessToken:  string | null
  refreshToken: string | null
  user:         AuthUser | null
  isAuthenticated: boolean
  setAuth:  (accessToken: string, refreshToken: string, user: AuthUser) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout:   () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken:     null,
      refreshToken:    null,
      user:            null,
      isAuthenticated: false,

      setAuth: (accessToken, refreshToken, user) => {
        localStorage.setItem('token', accessToken)
        set({ accessToken, refreshToken, user, isAuthenticated: true })
      },

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('token', accessToken)
        set({ accessToken, refreshToken })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
