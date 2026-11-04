import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { emailsApi } from '../../api/emails'
import { useAppStore } from '../../store/app'
import type { Email } from '../../types'
import { Spinner } from '../../components/ui/Spinner'

export function InboxPage() {
  const [params] = useSearchParams()
  const aliasId = params.get('alias_id') ? Number(params.get('alias_id')) : undefined

  const [emails, setEmails] = useState<Email[]>([])
  const [selected, setSelected] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState('')
  const [replying, setReplying] = useState(false)
  const { decrementUnread, aliases } = useAppStore()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await emailsApi.list({ alias_id: aliasId, per_page: 50 })
      setEmails(res.data)
    } catch {}
    setLoading(false)
  }, [aliasId])

  useEffect(() => { load() }, [load])

  async function open(email: Email) {
    setSelected(email)
    setReplyBody('')
    if (!email.is_read) {
      try {
        await emailsApi.markRead(email.id)
        setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, is_read: true } : e))
        decrementUnread()
      } catch {}
    }
    if (!email.body_html && !email.body_text) {
      try {
        const full = await emailsApi.show(email.id)
        setSelected(full)
      } catch {}
    }
  }

  async function handleDelete(email: Email) {
    if (!confirm('Supprimer ce message ?')) return
    await emailsApi.destroy(email.id)
    setEmails((prev) => prev.filter((e) => e.id !== email.id))
    if (selected?.id === email.id) setSelected(null)
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !replyBody.trim()) return
    setReplying(true)
    try {
      await emailsApi.reply(selected.id, { body_text: replyBody })
      setReplyBody('')
    } catch (err: any) {
      alert(err.message ?? 'Erreur lors de l\'envoi.')
    } finally {
      setReplying(false)
    }
  }

  const unread = emails.filter((e) => !e.is_read).length
  const initials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  const avatarColor = (id: number) => {
    const colors = ['#5B84C4', '#6B9E7A', '#C4855B', '#9B6BC4', '#C4B85B']
    return colors[id % colors.length]
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">
          {aliasId ? `Boîte filtrée` : 'Boîte de réception'}
        </span>
        <div className="topbar-search">
          <SearchIcon />
          Rechercher…
        </div>
        <Link to="/app/compose" className="btn btn-primary btn-sm">
          + Nouveau message
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={load} title="Actualiser">
          <RefreshIcon />
        </button>
      </div>

      <div className="split">
        {/* ── Colonne liste ── */}
        <div className="conv-col">
          <div className="conv-toolbar">
            <span className="label-title">
              {aliasId ? 'Filtrée' : 'Tous les messages'}
            </span>
            {unread > 0 && <span className="badge badge-unread">{unread}</span>}
          </div>

          {loading ? (
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <Spinner />
            </div>
          ) : emails.length === 0 ? (
            <div style={{ display: 'grid', placeItems: 'center', flex: 1, color: 'var(--ink-30)', fontSize: 'var(--fs-sm)' }}>
              Aucun message
            </div>
          ) : (
            <div className="conv-list">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`cv${selected?.id === email.id ? ' active' : ''}`}
                  onClick={() => open(email)}
                >
                  {!email.is_read && <div className="cv-unread-dot" />}
                  <div className="cv-top">
                    <span className="cv-who">{email.from_name ?? email.from_email}</span>
                    <span className="cv-time">{formatDate(email.received_at)}</span>
                  </div>
                  <div className="cv-sub">{email.subject}</div>
                  <div className="cv-preview">
                    {email.alias?.local_part}@{email.alias?.domain?.domain}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Colonne thread ── */}
        <div className="thread-col">
          {selected ? (
            <>
              <div className="thread-header">
                <h2>{selected.subject}</h2>
                <div className="thread-meta">
                  <span className="badge badge-neutral">{selected.alias?.local_part}@{selected.alias?.domain?.domain}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-55)' }}>
                    {formatDateLong(selected.received_at)}
                  </span>
                </div>
                <div className="thread-acts">
                  <button className="btn btn-secondary btn-sm" onClick={() => setReplyBody('Répondre…')}>
                    Répondre
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Archiver">
                    Archiver
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(selected)} title="Supprimer">
                    <TrashIcon />
                  </button>
                </div>
              </div>

              <div className="messages">
                {/* Carte message reçu */}
                <div className="msg-card">
                  <div className="msg-top">
                    <div className="msg-av" style={{ background: avatarColor(selected.id), color: '#fff' }}>
                      {initials(selected.from_name ?? selected.from_email)}
                    </div>
                    <div className="msg-who">
                      <div className="msg-name">{selected.from_name ?? selected.from_email}</div>
                      {selected.from_name && (
                        <div className="msg-email">{selected.from_email}</div>
                      )}
                    </div>
                    <div className="msg-time">{formatDateLong(selected.received_at)}</div>
                  </div>
                  <div className="msg-body">
                    {selected.body_html ? (
                      <div dangerouslySetInnerHTML={{ __html: sanitize(selected.body_html) }} />
                    ) : (
                      <p style={{ whiteSpace: 'pre-wrap' }}>{selected.body_text ?? '(message vide)'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Zone de réponse */}
              <form className="reply-box" onSubmit={handleReply}>
                <div className="reply-from">
                  <span>Répondre depuis :</span>
                  <select defaultValue="">
                    {aliases.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.local_part}@{a.domain?.domain}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="reply-input"
                  rows={3}
                  placeholder="Votre réponse…"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
                <div className="reply-foot">
                  <div className="spacer" />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReplyBody('')}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={replying || !replyBody.trim()}>
                    {replying ? <Spinner size={14} /> : 'Envoyer'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="thread-empty">
              <InboxEmptyIcon />
              <p>Sélectionnez un message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function sanitize(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function SearchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M13 2v4H9M1 12V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.09 8A6 6 0 0113 8.5M12.91 6A6 6 0 011 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3h12M5 3V2h4v1M2 3l1 9h6l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function InboxEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 12px' }}>
      <rect x="4" y="8" width="40" height="32" rx="4" stroke="var(--gray-mid)" strokeWidth="2" fill="none"/>
      <path d="M4 20h11l3 4h12l3-4h11" stroke="var(--gray-mid)" strokeWidth="2" fill="none"/>
    </svg>
  )
}
