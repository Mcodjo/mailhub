import { api } from './client'
import type { Email, SentEmail, PaginatedResponse } from '../types'

interface ListParams {
  alias_id?: number
  thread_id?: number
  unread?: boolean
  per_page?: number
  page?: number
}

export const emailsApi = {
  list: (params: ListParams = {}) => {
    const q = new URLSearchParams()
    if (params.alias_id)  q.set('alias_id',  String(params.alias_id))
    if (params.thread_id) q.set('thread_id', String(params.thread_id))
    if (params.unread)    q.set('unread', '1')
    if (params.per_page)  q.set('per_page',  String(params.per_page))
    if (params.page)      q.set('page',      String(params.page))
    const qs = q.toString()
    return api.get<PaginatedResponse<Email>>(`/emails${qs ? `?${qs}` : ''}`)
  },

  unreadCount: () => api.get<{ unread_count: number }>('/emails/unread-count'),

  show: (id: number) => api.get<Email>(`/emails/${id}`),

  markRead:   (id: number) => api.patch<{ id: number; is_read: boolean }>(`/emails/${id}/read`),
  markUnread: (id: number) => api.patch<{ id: number; is_read: boolean }>(`/emails/${id}/unread`),

  destroy: (id: number) => api.delete<void>(`/emails/${id}`),

  send: (data: {
    alias_id: number
    to: string[]
    cc?: string[]
    subject: string
    body_html?: string
    body_text?: string
  }) => api.post<SentEmail>('/emails/send', data),

  reply: (id: number, data: {
    body_html?: string
    body_text?: string
    cc?: string[]
  }) => api.post<SentEmail>(`/emails/${id}/reply`, data),
}
