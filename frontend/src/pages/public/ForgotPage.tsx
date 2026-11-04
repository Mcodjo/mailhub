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
      <div className="auth-card">
        <div className="auth-logo"><Logo height={44} /></div>
        <h1>Mot de passe oublié</h1>
        <p className="sub">Entrez votre email pour recevoir un lien de réinitialisation.</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

        {sent ? (
          <div className="alert alert-success" style={{ marginBottom: 'var(--s4)' }}>
            Si un compte existe pour cette adresse, un email a été envoyé.
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="email">Adresse email</label>
              <input id="email" type="email" className="input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com" autoComplete="email" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <Spinner size={16} /> : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <p style={{ marginTop: 'var(--s5)', fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', textAlign: 'center' }}>
          <Link to="/login" style={{ fontWeight: 700 }}>← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  )
}
