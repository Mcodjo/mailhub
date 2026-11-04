import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth'
import { Logo } from '../../components/ui/Logo'
import { Spinner } from '../../components/ui/Spinner'

export function ForgotPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--gray)', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 'var(--s6) var(--s4)' }}>
      <div>
        <div className="auth-card">
          <div className="auth-logo"><Logo height={44} /></div>

          {sent ? (
            <div className="confirm-state">
              <div className="confirm-icon" aria-hidden="true">
                <svg width="22" height="22" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
              </div>
              <h2>E-mail envoyé</h2>
              <p>Si cette adresse est associée à un compte Domial, vous recevrez un lien d'ici quelques minutes. Pensez à vérifier vos spams.</p>
              <Link to="/login" className="back-link" style={{ justifyContent: 'center', marginTop: 'var(--s5)' }}>
                <BackIcon />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h1>Mot de passe oublié</h1>
              <p className="sub">Entrez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

              {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label className="field-label" htmlFor="email">Adresse e-mail</label>
                  <input id="email" type="email" className="input" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.fr" autoComplete="email" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? <Spinner size={16} /> : 'Envoyer le lien'}
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

function BackIcon() {
  return (
    <svg width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}
