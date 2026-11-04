export interface User {
  id: number
  name: string
  email: string
  google_id: string | null
  created_at: string
}

export interface Domain {
  id: number
  user_id: number
  domain: string
  status: 'pending' | 'dns_verified' | 'active'
  cloudflare_zone_id: string | null
  send_from_verified_at: string | null
  created_at: string
}

export interface Alias {
  id: number
  domain_id: number
  local_part: string
  is_primary: boolean
  send_from_verified_at: string | null
  created_at: string
  domain?: Domain
}

export interface Email {
  id: number
  user_id: number
  alias_id: number
  thread_id: number | null
  message_id: string
  from_email: string
  from_name: string | null
  subject: string
  body_text?: string
  body_html?: string
  attachments_count: number
  is_read: boolean
  received_at: string
  alias?: Alias
  thread?: Thread
}

export interface SentEmail {
  id: number
  user_id: number
  alias_id: number
  thread_id: number | null
  from_email: string
  to_emails: string[]
  cc_emails: string[]
  subject: string
  body_text?: string
  body_html?: string
  sent_at: string
}

export interface Thread {
  id: number
  domain_id: number
  subject: string
}

export interface DnsRecord {
  type: string
  name: string
  value: string
  priority?: number
  status: 'ok' | 'missing' | 'waiting_cf'
}

export interface GmailStatus {
  connected: boolean
  expires_at?: string
  scope_ok?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiError {
  error?: { code: string; message: string }
  message?: string
  errors?: Record<string, string[]>
}
