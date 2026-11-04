import { create } from 'zustand'
import { clearToken } from '../api/client'
import type { User } from '../types'

interface AuthState {
  user: User | null
  ready: boolean // hydratation terminée (évite le flash de login)
  setUser: (user: User | null) => void
  setReady: (ready: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,

  setUser: (user) => set({ user }),
  setReady: (ready) => set({ ready }),

  logout: () => {
    clearToken()
    set({ user: null })
  },
}))
