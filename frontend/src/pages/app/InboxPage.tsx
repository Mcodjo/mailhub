import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const { decrementUnread } = useAppStore()

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

  return (
    <div className="split">
      {/* ── Colonne liste ── */}
      <div className="conv-col">
        <div className="conv-toolbar">
          <span className="label-title">
            {aliasId ? 'Boîte filtrée' : 'Boîte de réception'}
          </span>
          {unread > 0 && <span className="badge">{unread}</span>}
          <button className="btn btn-ghost btn-sm" onClick={load} title="Actualiser">
            <RefreshIcon />
          </button>
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
                className={`cv${!email.is_read ? ' unread' : ''}${selected?.id === email.id ? ' active' : ''}`}
                onClick={() => open(email)}
              >
                <div className="cv-top">
                  <span className="cv-from">{email.from_name ?? email.from_email}</span>
                  <span className="cv-date">{formatDate(email.received_at)}</span>
                </div>
                <div className="cv-subject">{email.subject}</div>
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
              <h2 className="thread-subject">{selected.subject}</h2>
              <div className="thread-meta">
                <span>De : <strong>{selected.from_name ?? selected.from_email}</strong></span>
                {selected.from_name && <span style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-xs)' }}>&lt;{selected.from_email}&gt;</span>}
                <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-xs)', color: 'var(--ink-55)' }}>
                  {formatDateLong(selected.received_at)}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(selected)} title="Supprimer">
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="thread-body">
              {selected.body_html ? (
                <iframe
                  srcDoc={selected.body_html}
                  sandbox="allow-same-origin"
                  style={{ width: '100%', border: 'none', minHeight: 300 }}
                  onLoad={(e) => {
                    const f = e.currentTarget
                    f.style.height = f.contentDocument?.body?.scrollHeight + 'px'
                  }}
                />
              ) : (
                <pre style={{ fontFamily: 'var(--font)', whiteSpace: 'pre-wrap', fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh)' }}>
                  {selected.body_text ?? '(message vide)'}
                </pre>
              )}
            </div>

            {/* Zone de réponse */}
            <form className="reply-box" onSubmit={handleReply}>
              <textarea
                className="input"
                rows={4}
                placeholder="Votre réponse…"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--s2)', marginTop: 'var(--s2)' }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReplyBody('')}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={replying || !replyBody.trim()}>
                  {replying ? <Spinner size={14} /> : 'Répondre'}
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
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────
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

// ── Icônes ────────────────────────────────────────────────────────────────
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
