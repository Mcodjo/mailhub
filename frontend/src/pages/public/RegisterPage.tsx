import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, googleAuthUrl } from '../../api/auth'
import { useAuthStore } from '../../store/auth'
import { Logo } from '../../components/ui/Logo'
import { Spinner } from '../../components/ui/Spinner'

export function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [consent, setConsent]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const strength = pwStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (!consent) { setError('Veuillez accepter les conditions d\'utilisation.'); return }
    setLoading(true); setError(null)
    const name = [firstName, lastName].filter(Boolean).join(' ') || firstName
    try {
      const { user } = await register(name, email, password, confirm)
      setUser(user)
      navigate('/app/onboarding', { replace: true })
    } catch (err: any) {
      const data = err.data
      if (data?.errors) {
        const msgs = Object.values(data.errors as Record<string, string[]>).flat()
        setError(msgs[0] ?? 'Erreur de validation.')
      } else {
        setError(err.message ?? 'Une erreur est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--gray)', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--s6) var(--s4)' }}>
      <div>
        <div className="auth-card">
          <div className="auth-logo"><Logo height={44} /></div>

          <h1>Créer un compte</h1>
          <p className="sub">Votre premier domaine est gratuit. Aucune carte bancaire.</p>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

          <a href={googleAuthUrl()} className="btn-google">
            <GoogleIcon />
            S'inscrire avec Google
          </a>
          <div className="sep">ou</div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="firstName">Prénom</label>
                <input id="firstName" type="text" className="input" value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Thomas" autoComplete="given-name" required />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="lastName">Nom</label>
                <input id="lastName" type="text" className="input" value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Leclerc" autoComplete="family-name" />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="email">Adresse e-mail</label>
              <input id="email" type="email" className="input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr" autoComplete="email" required />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="password">Mot de passe</label>
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

            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>
                J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                <a href="#">politique de confidentialité</a>.
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <Spinner size={16} /> : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth-foot">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}
