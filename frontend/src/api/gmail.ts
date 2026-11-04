import { api } from './client'
import type { GmailStatus } from '../types'

export const gmailApi = {
  status: () => api.get<GmailStatus>('/gmail/status'),
  connectUrl: () => api.get<{ url: string }>('/gmail/connect/redirect'),
  verifyAlias: (alias_id: number) => api.post<{ message: string }>('/gmail/verify-alias', { alias_id }),
  disconnect: () => api.delete<{ message: string }>('/gmail/connect'),
}
