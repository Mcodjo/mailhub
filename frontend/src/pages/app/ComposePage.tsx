import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { emailsApi } from '../../api/emails'
import { useAppStore } from '../../store/app'
import { Spinner } from '../../components/ui/Spinner'

export function ComposePage() {
  const { aliases } = useAppStore()
  const navigate = useNavigate()

  const [aliasId, setAliasId] = useState<number>(aliases[0]?.id ?? 0)
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const toList = to.split(',').map((s) => s.trim()).filter(Boolean)
    if (!toList.length) { setError('Ajoutez au moins un destinataire.'); return }
    setLoading(true); setError(null)
    try {
      await emailsApi.send({ alias_id: aliasId, to: toList, subject, body_text: body })
      navigate('/app/inbox')
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  if (!aliases.length) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--ink-55)', fontSize: 'var(--fs-sm)' }}>
        Configurez d'abord un domaine et un alias pour envoyer des emails.
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 'var(--s6)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', background: 'var(--white)', borderRadius: 'var(--r-xl)', border: 'var(--border)', boxShadow: 'var(--sh-2)', overflow: 'hidden' }}>
        {/* En-tête */}
        <div style={{ padding: 'var(--s5) var(--s6)', borderBottom: 'var(--border)', display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
          <h1 style={{ fontSize: 'var(--fs-md)', fontWeight: 700, flex: 1 }}>Nouveau message</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>Annuler</button>
        </div>

        <form onSubmit={handleSend}>
          <div style={{ padding: 'var(--s4) var(--s6)' }}>
            {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

            {/* De */}
            <div className="field">
              <label className="field-label">De</label>
              <select
                className="input"
                value={aliasId}
                onChange={(e) => setAliasId(Number(e.target.value))}
              >
                {aliases.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.local_part}@{a.domain?.domain}
                    {!a.send_from_verified_at ? ' (non vérifié)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* À */}
            <div className="field">
              <label className="field-label">À</label>
              <input
                type="text" className="input" value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="destinataire@exemple.com, autre@exemple.com"
                required
              />
            </div>

            {/* Objet */}
            <div className="field">
              <label className="field-label">Objet</label>
              <input
                type="text" className="input" value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet du message" required
              />
            </div>

            {/* Corps */}
            <div className="field">
              <label className="field-label">Message</label>
              <textarea
                className="input" rows={12} value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Rédigez votre message…" required
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Pied */}
          <div style={{ padding: 'var(--s4) var(--s6)', borderTop: 'var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--s2)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Spinner size={16} /> : (
                <>
                  <SendIcon />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M13 1L1 5.5l5 2 2 5L13 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M6 7.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
