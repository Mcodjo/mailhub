import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { gmailApi } from '../../api/gmail'
import { aliasesApi } from '../../api/domains'
import { useAppStore } from '../../store/app'
import { useAuthStore } from '../../store/auth'
import type { GmailStatus } from '../../types'
import { Spinner } from '../../components/ui/Spinner'

type Tab = 'compte' | 'gmail' | 'alias' | 'domaines'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const { domains, aliases, setAliases, activeDomain } = useAppStore()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>('compte')
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null)
  const [gmailLoading, setGmailLoading] = useState(false)
  const [newAlias, setNewAlias] = useState('')
  const [aliasLoading, setAliasLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const notification = params.get('gmail')

  useEffect(() => {
    if (notification === 'connected') setTab('gmail')
    gmailApi.status().then(setGmailStatus).catch(() => {})
  }, [notification])

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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '??'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Paramètres</span>
      </div>

      <div className="content">
        <div className="settings-wrap">
          {/* Notifications */}
          {notification === 'connected' && (
            <div className="alert alert-success">Gmail connecté avec succès.</div>
          )}
          {notification === 'error' && (
            <div className="alert alert-error">La connexion Gmail a échoué.</div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Onglets */}
          <div className="tabs">
            {(['compte', 'gmail', 'alias', 'domaines'] as Tab[]).map((t) => (
              <button
                key={t}
                className={`tab${tab === t ? ' active' : ''}`}
                onClick={() => { setTab(t); setError(null); setSuccess(null) }}
              >
                {t === 'compte' ? 'Mon compte'
                  : t === 'gmail' ? 'Gmail'
                  : t === 'alias' ? 'Alias'
                  : 'Domaines'}
              </button>
            ))}
          </div>

          {/* ── Compte ── */}
          {tab === 'compte' && (
            <div className="set-card">
              <div className="set-card-head">
                <h2>Mon compte</h2>
                <p>Informations de votre profil Domial.</p>
              </div>
              <div className="avatar-row">
                <div className="avatar-big">{initials}</div>
                <div className="avatar-info">
                  <strong>{user?.name}</strong>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="set-row">
                <div className="set-row-info">
                  <label>Nom complet</label>
                  <p>Votre nom d'affichage dans l'application.</p>
                </div>
                <div className="set-row-control">
                  <input type="text" className="input" defaultValue={user?.name ?? ''} readOnly />
                </div>
              </div>
              <div className="set-row">
                <div className="set-row-info">
                  <label>Adresse email</label>
                  <p>Email de connexion à votre compte.</p>
                </div>
                <div className="set-row-control">
                  <input type="email" className="input" defaultValue={user?.email ?? ''} readOnly />
                </div>
              </div>
            </div>
          )}

          {/* ── Gmail ── */}
          {tab === 'gmail' && (
            <div className="set-card">
              <div className="set-card-head">
                <h2>Connexion Gmail</h2>
                <p>Connectez votre compte Gmail pour envoyer des emails depuis vos alias Domial.</p>
              </div>
              <div className="set-row">
                <div className="set-row-info">
                  <label>Statut Gmail</label>
                  <p>Autorisez Domial à envoyer via votre compte Gmail.</p>
                </div>
                <div className="set-row-control">
                  {gmailStatus === null ? (
                    <Spinner />
                  ) : gmailStatus.connected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--success)', fontWeight: 600 }}>
                        ✓ Connecté{gmailStatus.scope_ok ? '' : ' (scope insuffisant)'}
                      </span>
                      <button className="btn btn-secondary btn-sm" onClick={handleDisconnectGmail} disabled={gmailLoading}>
                        {gmailLoading ? <Spinner size={14} /> : 'Déconnecter'}
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={handleConnectGmail} disabled={gmailLoading}>
                      {gmailLoading ? <Spinner size={14} /> : 'Connecter Gmail'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Alias ── */}
          {tab === 'alias' && (
            <div className="set-card">
              <div className="set-card-head">
                <h2>Alias email</h2>
                <p>Gérez les adresses email associées à vos domaines.</p>
              </div>

              {activeDomain && (
                <div className="set-row">
                  <div className="set-row-info">
                    <label>Créer un alias</label>
                    <p>Ajoutez une nouvelle adresse sur {activeDomain.domain}.</p>
                  </div>
                  <div className="set-row-control">
                    <form onSubmit={handleAddAlias} style={{ display: 'flex', gap: 'var(--s2)' }}>
                      <div style={{ display: 'flex', background: 'var(--gray)', border: '1.5px solid transparent', borderRadius: 'var(--r-md)', overflow: 'hidden', flex: 1 }}>
                        <input
                          type="text" value={newAlias}
                          onChange={(e) => setNewAlias(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                          placeholder="contact"
                          style={{ flex: 1, padding: '8px 12px', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 'var(--fs-sm)' }}
                        />
                        <span style={{ padding: '8px 12px', fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', borderLeft: '1px solid var(--gray-mid)', whiteSpace: 'nowrap' }}>
                          @{activeDomain.domain}
                        </span>
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={aliasLoading}>
                        {aliasLoading ? <Spinner size={14} /> : 'Créer'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {aliases.length === 0 ? (
                <div className="set-row">
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>Aucun alias configuré.</p>
                </div>
              ) : aliases.map((a) => (
                <div key={a.id} className="set-row">
                  <div className="set-row-info">
                    <label>
                      {a.local_part}@{a.domain?.domain}
                      {a.is_primary && (
                        <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--steel-soft)', color: 'var(--steel)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>
                          principal
                        </span>
                      )}
                    </label>
                    <p>{a.send_from_verified_at ? 'Envoi vérifié' : 'Envoi non vérifié'}</p>
                  </div>
                  <div className="set-row-control" style={{ display: 'flex', gap: 'var(--s2)' }}>
                    {a.send_from_verified_at ? (
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--success)', fontWeight: 600 }}>✓ Vérifié</span>
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
                </div>
              ))}
            </div>
          )}

          {/* ── Domaines ── */}
          {tab === 'domaines' && (
            <div className="set-card">
              <div className="set-card-head">
                <h2>Domaines</h2>
                <p>Gérez les domaines configurés sur votre compte.</p>
              </div>

              <div className="set-row">
                <div className="set-row-info">
                  <label>Ajouter un domaine</label>
                  <p>Configurez un nouveau domaine email.</p>
                </div>
                <div className="set-row-control">
                  <a href="/app/wizard" className="btn btn-primary btn-sm">+ Ajouter un domaine</a>
                </div>
              </div>

              {domains.length === 0 ? (
                <div className="set-row">
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>Aucun domaine configuré.</p>
                </div>
              ) : domains.map((d) => (
                <div key={d.id} className="set-row">
                  <div className="set-row-info">
                    <label>{d.domain}</label>
                    <p>Ajouté le {new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="set-row-control">
                    <span className="badge" style={{
                      background: d.status === 'active' ? 'var(--success-bg)' : d.status === 'dns_verified' ? 'var(--steel-soft)' : 'var(--warning-bg)',
                      color: d.status === 'active' ? 'var(--success)' : d.status === 'dns_verified' ? 'var(--steel)' : 'var(--warning)',
                    }}>
                      {d.status === 'active' ? 'Actif' : d.status === 'dns_verified' ? 'DNS ok' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
