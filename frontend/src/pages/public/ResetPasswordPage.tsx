import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../api/auth'
import { useAuthStore } from '../../store/auth'
import { Logo } from '../../components/ui/Logo'
import { Spinner } from '../../components/ui/Spinner'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const emailFromUrl = searchParams.get('email') ?? ''

  const [email, setEmail] = useState(emailFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const strength = pwStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (!token) { setError('Lien de réinitialisation invalide ou expiré.'); return }
    setLoading(true); setError(null)
    try {
      const res = await resetPassword(token, email, password, confirm)
      if (res.token) {
        const { me } = await import('../../api/auth')
        const user = await me()
        setUser(user)
        navigate('/app/inbox', { replace: true })
      } else {
        setDone(true)
      }
    } catch (err: any) {
      setError(err.message ?? 'Lien invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--gray)', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--s6) var(--s4)' }}>
      <div>
        <div className="auth-card">
          <div className="auth-logo"><Logo height={44} /></div>

          {done ? (
            <div className="confirm-state">
              <div className="confirm-icon" aria-hidden="true">
                <svg width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
              </div>
              <h2>Mot de passe modifié</h2>
              <p>Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.</p>
              <Link to="/login" className="back-link" style={{ justifyContent: 'center', marginTop: 'var(--s5)' }}>
                <BackIcon />
                Aller à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1>Nouveau mot de passe</h1>
              <p className="sub">Choisissez un mot de passe sécurisé pour votre compte.</p>

              {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                {!emailFromUrl && (
                  <div className="field">
                    <label className="field-label" htmlFor="email">Adresse e-mail</label>
                    <input id="email" type="email" className="input" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com" autoComplete="email" required />
                  </div>
                )}
                <div className="field">
                  <label className="field-label" htmlFor="password">Nouveau mot de passe</label>
                  <input id="password" type="password" className="input" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 caractères minimum" autoComplete="new-password" required minLength={8} />
                  <div className="pw-meter" aria-label="Force du mot de passe">
                    <div className={`pw-seg${strength >= 1 ? ' on' : ''}`} />
                    <div className={`pw-seg${strength >= 2 ? ' on' : ''}${strength >= 3 ? ' ok' : ''}`} />
                    <div className={`pw-seg${strength >= 3 ? ' ok' : ''}`} />
                    <div className={`pw-seg${strength >= 4 ? ' ok' : ''}`} />
                  </div>
                  {strength < 3 && password && (
                    <p className="pw-hint">Ajoutez un chiffre ou un symbole pour renforcer le mot de passe</p>
                  )}
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="confirm">Confirmer le mot de passe</label>
                  <input id="confirm" type="password" className="input" value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password" required />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? <Spinner size={16} /> : 'Réinitialiser le mot de passe'}
                </button>
              </form>

              <Link to="/login" className="back-link">
                <BackIcon />
                Retour à la connexion
              </Link>
            </>
          )}
        </div>
        <p className="page-foot">
          <a href="#">Mentions légales</a> · <a href="#">Confidentialité</a>
        </p>
      </div>
    </div>
  )
}

function pwStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return score
}

function BackIcon() {
  return (
    <svg width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}
