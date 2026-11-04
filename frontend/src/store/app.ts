import { create } from 'zustand'
import type { Domain, Alias } from '../types'

interface AppState {
  domains: Domain[]
  activeDomain: Domain | null
  aliases: Alias[]
  unreadCount: number

  setDomains: (domains: Domain[]) => void
  setActiveDomain: (domain: Domain | null) => void
  setAliases: (aliases: Alias[]) => void
  setUnreadCount: (count: number) => void
  decrementUnread: () => void
}

export const useAppStore = create<AppState>((set) => ({
  domains: [],
  activeDomain: null,
  aliases: [],
  unreadCount: 0,

  setDomains: (domains) => set({
    domains,
    activeDomain: domains.find(d => d.status === 'active') ?? domains[0] ?? null,
  }),
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  setAliases: (aliases) => set({ aliases }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
}))
