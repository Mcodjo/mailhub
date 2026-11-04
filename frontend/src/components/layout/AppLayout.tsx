import { useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { useAppStore } from '../../store/app'
import { domainsApi, aliasesApi } from '../../api/domains'
import { emailsApi } from '../../api/emails'
import { Sidebar } from './Sidebar'
import { Spinner } from '../ui/Spinner'

const POLL_INTERVAL = 30_000

export function AppLayout() {
  const { user, ready } = useAuthStore()
  const { setDomains, setAliases, setUnreadCount } = useAppStore()
  const navigate = useNavigate()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!ready) return
    if (!user) { navigate('/login', { replace: true }); return }

    Promise.all([
      domainsApi.list(),
      aliasesApi.list(),
      emailsApi.unreadCount(),
    ]).then(([domains, aliases, { unread_count }]) => {
      setDomains(domains)
      setAliases(aliases)
      setUnreadCount(unread_count)
    }).catch(() => {})

    // Polling non-lus toutes les 30 s
    pollRef.current = setInterval(() => {
      emailsApi.unreadCount()
        .then(({ unread_count }) => setUnreadCount(unread_count))
        .catch(() => {})
    }, POLL_INTERVAL)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [user, ready])

  if (!ready) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <Spinner size={28} />
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  )
}
