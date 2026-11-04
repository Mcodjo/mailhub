import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gmailApi } from '../../api/gmail'
import { aliasesApi } from '../../api/domains'
import { useAppStore } from '../../store/app'
import { useAuthStore } from '../../store/auth'
import type { GmailStatus } from '../../types'
import { Spinner } from '../../components/ui/Spinner'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const { domains, aliases, setAliases, activeDomain } = useAppStore()
  const [params] = useSearchParams()
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null)
  const [gmailLoading, setGmailLoading] = useState(false)
  const [newAlias, setNewAlias] = useState('')
  const [aliasLoading, setAliasLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const notification = params.get('gmail')

  useEffect(() => {
    gmailApi.status().then(setGmailStatus).catch(() => {})
  }, [])

  async function handleConnectGmail() {
    setGmailLoading(true)
    try {
      const { url } = await gmailApi.connectUrl()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      setGmailLoading(false)
    }
  }

  async function handleDisconnectGmail() {
    if (!confirm('Déconnecter votre compte Gmail ?')) return
    setGmailLoading(true)
    try {
      await gmailApi.disconnect()
      setGmailStatus({ connected: false })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGmailLoading(false)
    }
  }

  async function handleVerifyAlias(aliasId: number) {
    setError(null); setSuccess(null)
    try {
      const res = await gmailApi.verifyAlias(aliasId)
      setSuccess(res.message)
      const updated = await aliasesApi.list()
      setAliases(updated)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleAddAlias(e: React.FormEvent) {
    e.preventDefault()
    if (!activeDomain) { setError('Sélectionnez un domaine actif.'); return }
    setAliasLoading(true); setError(null)
    try {
      await aliasesApi.create(activeDomain.id, newAlias)
      const updated = await aliasesApi.list()
      setAliases(updated)
      setNewAlias('')
      setSuccess(`Alias ${newAlias}@${activeDomain.domain} créé.`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAliasLoading(false)
    }
  }

  async function handleDeleteAlias(id: number) {
    if (!confirm('Supprimer cet alias ?')) return
    try {
      await aliasesApi.destroy(id)
      const updated = await aliasesApi.list()
      setAliases(updated)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Paramètres</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--s6) var(--s5)' }}>
        {notification === 'connected' && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--s4)' }}>Gmail connecté avec succès.</div>
        )}
        {notification === 'error' && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>La connexion Gmail a échoué.</div>
        )}
        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 'var(--s4)' }}>{success}</div>}

        {/* ── Compte ── */}
        <section className="card" style={{ marginBottom: 'var(--s4)' }}>
          <h2 style={{ marginBottom: 'var(--s4)' }}>Compte</h2>
          <div style={{ display: 'flex', gap: 'var(--s4)', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--steel)', color: 'var(--white)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>{user?.email}</div>
            </div>
          </div>
        </section>

        {/* ── Gmail ── */}
        <section className="card" style={{ marginBottom: 'var(--s4)' }}>
          <h2 style={{ marginBottom: 'var(--s2)' }}>Connexion Gmail</h2>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', marginBottom: 'var(--s4)' }}>
            Connectez votre compte Gmail pour envoyer des emails depuis vos alias Domial.
          </p>
          {gmailStatus === null ? (
            <Spinner />
          ) : gmailStatus.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
              <span className="alert alert-success" style={{ flex: 1 }}>
                Gmail connecté{gmailStatus.scope_ok ? '' : ' (scope insuffisant — reconnectez)'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleDisconnectGmail} disabled={gmailLoading}>
                {gmailLoading ? <Spinner size={14} /> : 'Déconnecter'}
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleConnectGmail} disabled={gmailLoading}>
              {gmailLoading ? <Spinner size={16} /> : 'Connecter Gmail'}
            </button>
          )}
        </section>

        {/* ── Domaines ── */}
        <section className="card" style={{ marginBottom: 'var(--s4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--s4)' }}>
            <h2 style={{ flex: 1 }}>Domaines</h2>
            <a href="/app/wizard" className="btn btn-secondary btn-sm">+ Ajouter un domaine</a>
          </div>
          {domains.length === 0 ? (
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>Aucun domaine configuré.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
              {domains.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', padding: 'var(--s3) 0', borderBottom: 'var(--border)' }}>
                  <span style={{ flex: 1, fontWeight: 600 }}>{d.domain}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                    background: d.status === 'active' ? 'var(--success-bg)' : d.status === 'dns_verified' ? 'var(--steel-soft)' : 'var(--warning-bg)',
                    color: d.status === 'active' ? 'var(--success)' : d.status === 'dns_verified' ? 'var(--steel)' : 'var(--warning)',
                  }}>
                    {d.status === 'active' ? 'Actif' : d.status === 'dns_verified' ? 'DNS ok' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Alias ── */}
        <section className="card">
          <h2 style={{ marginBottom: 'var(--s4)' }}>Alias</h2>

          {activeDomain && (
            <form onSubmit={handleAddAlias} style={{ display: 'flex', gap: 'var(--s2)', marginBottom: 'var(--s4)' }}>
              <div style={{ display: 'flex', flex: 1, background: 'var(--gray)', border: '1.5px solid transparent', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <input
                  type="text" value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                  placeholder="contact"
                  style={{ flex: 1, padding: '10px 14px', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 'var(--fs-sm)', fontWeight: 500 }}
                />
                <span style={{ padding: '10px 14px', fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', borderLeft: '1px solid var(--gray-mid)', whiteSpace: 'nowrap' }}>
                  @{activeDomain.domain}
                </span>
              </div>
              <button type="submit" className="btn btn-primary" disabled={aliasLoading}>
                {aliasLoading ? <Spinner size={16} /> : 'Créer'}
              </button>
            </form>
          )}

          {aliases.length === 0 ? (
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>Aucun alias configuré.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
              {aliases.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', padding: 'var(--s3) 0', borderBottom: 'var(--border)' }}>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 'var(--fs-sm)' }}>
                    {a.local_part}@{a.domain?.domain}
                    {a.is_primary && <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--steel-soft)', color: 'var(--steel)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>principal</span>}
                  </span>
                  {a.send_from_verified_at ? (
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--success)', fontWeight: 600 }}>✓ Envoi vérifié</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleVerifyAlias(a.id)}>
                      Vérifier l'envoi
                    </button>
                  )}
                  {!a.is_primary && (
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteAlias(a.id)} title="Supprimer">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
