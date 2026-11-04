import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { useAppStore } from '../../store/app'
import { logout as apiLogout } from '../../api/auth'
import { Logo } from '../ui/Logo'

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuthStore()
  const { domains, activeDomain, setActiveDomain, aliases, unreadCount } = useAppStore()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??'

  async function handleLogout() {
    try { await apiLogout() } catch {}
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Logo height={22} />
      </div>

      {/* Sélecteur de domaine */}
      {domains.length > 0 && (
        <div style={{ padding: '12px 12px 0' }}>
          {domains.map((d) => (
            <button
              key={d.id}
              className="domain-pick"
              style={{ marginBottom: 4 }}
              onClick={() => setActiveDomain(d)}
            >
              <span className="domain-name">{d.domain.split('.')[0]}</span>
              <span className="domain-tld">.{d.domain.split('.').slice(1).join('.')}</span>
              {activeDomain?.id === d.id && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" fill="var(--steel)" />
                </svg>
              )}
              {d.status !== 'active' && (
                <span style={{ fontSize: 9, background: 'var(--warning-bg)', color: 'var(--warning)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
                  Config
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Navigation principale */}
      <nav className="nav-section">
        <div className="nav-label">Messagerie</div>
        <NavLink to="/app/inbox" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <InboxIcon />
          Boîte de réception
          {unreadCount > 0 && (
            <span className="badge badge-unread" style={{ marginLeft: 'auto' }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/app/compose" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <ComposeIcon />
          Composer
        </NavLink>
      </nav>

      {/* Alias boîtes */}
      {aliases.length > 0 && (
        <nav className="nav-section" style={{ marginTop: 4 }}>
          <div className="nav-label">Mes adresses</div>
          {aliases.map((a) => (
            <NavLink
              key={a.id}
              to={`/app/inbox?alias_id=${a.id}`}
              className={({ isActive }) => `alias-link${isActive ? ' active' : ''}`}
            >
              <span className="alias-dot" style={{ background: aliasColor(a.id) }} />
              <span className="alias-name">{a.local_part}@{a.domain?.domain}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {/* Configuration */}
      <nav className="nav-section" style={{ marginTop: 4 }}>
        <div className="nav-label">Configuration</div>
        <NavLink to="/app/wizard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <DomainIcon />
          DNS &amp; Domaines
        </NavLink>
        <NavLink to="/app/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <SettingsIcon />
          Paramètres
        </NavLink>
      </nav>

      {/* Pied de sidebar */}
      <div className="sidebar-foot">
        <div className="foot-av">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="foot-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name}
          </div>
          <div className="foot-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button className="foot-settings btn btn-ghost btn-sm" onClick={handleLogout} title="Déconnexion">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  )
}

function aliasColor(id: number): string {
  const colors = ['#5B84C4', '#6B9E7A', '#C4855B', '#9B6BC4', '#C4B85B']
  return colors[id % colors.length]
}

// ── Icônes 16×16 stroke ───────────────────────────────────────────────────
function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: 'none' }}>
      <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M1 10h3l1.5 2h5L12 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}
function ComposeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: 'none' }}>
      <path d="M2 10.5V14h3.5l7-7L9 3.5l-7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M11.5 2l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function DomainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: 'none' }}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 1.5C6 4 5 6 5 8s1 4 3 6.5M8 1.5C10 4 11 6 11 8s-1 4-3 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: 'none' }}>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flex: 'none' }}>
      <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
