import { api } from './client'
import type { Domain, Alias, DnsRecord } from '../types'

export const domainsApi = {
  list: () => api.get<Domain[]>('/domains'),
  create: (domain: string) => api.post<Domain>('/domains', { domain }),
  show: (id: number) => api.get<Domain>(`/domains/${id}`),
  destroy: (id: number) => api.delete<void>(`/domains/${id}`),

  dnsRecords: (id: number) => api.get<{ records: DnsRecord[]; all_verified: boolean }>(`/domains/${id}/dns`),
  verifyDns: (id: number) => api.post<{ records: DnsRecord[]; all_verified: boolean }>(`/domains/${id}/dns/verify`),

  connectCloudflare: (id: number, token: string, zone_id: string) =>
    api.post<Domain>(`/domains/${id}/cloudflare/connect`, { token, zone_id }),

  activate: (id: number) => api.post<Domain>(`/domains/${id}/activate`),
}

export const aliasesApi = {
  list: () => api.get<Alias[]>('/aliases'),
  create: (domainId: number, local_part: string) =>
    api.post<Alias>(`/domains/${domainId}/aliases`, { local_part }),
  destroy: (id: number) => api.delete<void>(`/aliases/${id}`),
}
