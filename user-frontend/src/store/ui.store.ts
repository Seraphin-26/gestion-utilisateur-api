import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Lang } from '../types'

interface UIState {
  theme: Theme
  lang:  Lang
  toggleTheme: () => void
  setLang: (lang: Lang) => void
}

const applyTheme = (theme: Theme) => {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  }
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      lang:  'fr',

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },

      setLang: (lang) => {
        localStorage.setItem('lang', lang)
        set({ lang })
      },
    }),
    {
      name: 'ui-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme)
      },
    }
  )
)