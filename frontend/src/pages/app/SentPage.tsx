import { useEffect, useState, useCallback } from 'react'
import { emailsApi } from '../../api/emails'
import type { SentEmail } from '../../types'
import { Spinner } from '../../components/ui/Spinner'

export function SentPage() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [selected, setSelected] = useState<SentEmail | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await emailsApi.listSent({ per_page: 25, page: p })
      setEmails(res.data)
      setLastPage(res.last_page)
      setTotal(res.total)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { load(page) }, [load, page])

  async function open(email: SentEmail) {
    setSelected(email)
    if (!email.body_html && !email.body_text) {
      try {
        const full = await emailsApi.showSent(email.id)
        setSelected(full)
      } catch {}
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Topbar */}
      <div className="topbar">
        <span className="topbar-title">Envoyés</span>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-55)' }}>
          {total} message{total !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="split">
        {/* ── Liste ── */}
        <div className="conv-col">
          <div className="conv-toolbar">
            <span className="label-title">Tous les envois</span>
          </div>

          {loading ? (
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <Spinner />
            </div>
          ) : emails.length === 0 ? (
            <div style={{ display: 'grid', placeItems: 'center', flex: 1, color: 'var(--ink-30)', fontSize: 'var(--fs-sm)' }}>
              Aucun message envoyé
            </div>
          ) : (
            <>
              <div className="conv-list">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className={`cv${selected?.id === email.id ? ' active' : ''}`}
                    onClick={() => open(email)}
                  >
                    <div className="cv-top">
                      <span className="cv-who">
                        À : {Array.isArray(email.to_emails)
                          ? email.to_emails.join(', ')
                          : String(email.to_emails)}
                      </span>
                      <span className="cv-time">{formatDate(email.sent_at)}</span>
                    </div>
                    <div className="cv-sub">{email.subject}</div>
                    <div className="cv-preview">{email.from_email}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s3)', padding: 'var(--s3)', borderTop: 'var(--border)', fontSize: 'var(--fs-xs)', color: 'var(--ink-55)' }}>
                  <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Préc.</button>
                  <span>{page} / {lastPage}</span>
                  <button className="btn btn-ghost btn-sm" disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Suiv. ›</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Détail ── */}
        <div className="thread-col">
          {selected ? (
            <>
              <div className="thread-header">
                <h2>{selected.subject}</h2>
                <div className="thread-meta">
                  <span className="badge badge-neutral" style={{ background: 'var(--steel-soft)', color: 'var(--steel)' }}>
                    Envoyé
                  </span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--ink-55)' }}>
                    {formatDateLong(selected.sent_at)}
                  </span>
                </div>
                <div className="thread-acts" style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', gap: 'var(--s4)' }}>
                  <span>
                    <strong>De :</strong> {selected.from_email}
                  </span>
                  <span>
                    <strong>À :</strong>{' '}
                    {Array.isArray(selected.to_emails)
                      ? selected.to_emails.join(', ')
                      : String(selected.to_emails)}
                  </span>
                  {Array.isArray(selected.cc_emails) && selected.cc_emails.length > 0 && (
                    <span><strong>Cc :</strong> {selected.cc_emails.join(', ')}</span>
                  )}
                </div>
              </div>

              <div className="messages">
                <div className="msg-card">
                  <div className="msg-body">
                    {selected.body_html ? (
                      <div dangerouslySetInnerHTML={{ __html: sanitize(selected.body_html) }} />
                    ) : (
                      <p style={{ whiteSpace: 'pre-wrap' }}>{selected.body_text ?? '(message vide)'}</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="thread-empty">
              <SentEmptyIcon />
              <p>Sélectionnez un message envoyé</p>
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

function SentEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 12px' }}>
      <path d="M6 42L42 24 6 6v14l24 4-24 4v14z" stroke="var(--gray-mid)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
  )
}
