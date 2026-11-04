import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, googleAuthUrl } from '../../api/auth'
import { useAuthStore } from '../../store/auth'
import { Logo } from '../../components/ui/Logo'
import { Spinner } from '../../components/ui/Spinner'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError(null)
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
      <div className="auth-card">
        <div className="auth-logo"><Logo height={44} /></div>

        <h1>Créer un compte</h1>
        <p className="sub">Commencez à recevoir vos emails pro depuis votre domaine.</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

        <a href={googleAuthUrl()} className="btn-google">
          <GoogleIcon />
          Continuer avec Google
        </a>
        <div className="sep">ou</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="name">Nom complet</label>
            <input id="name" type="text" className="input" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont" autoComplete="name" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">Adresse email</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Mot de passe</label>
            <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caractères" autoComplete="new-password" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="confirm">Confirmer le mot de passe</label>
            <input id="confirm" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••" autoComplete="new-password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-full" style={{ marginTop: 'var(--s2)' }} disabled={loading}>
            {loading ? <Spinner size={16} /> : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ marginTop: 'var(--s5)', fontSize: 'var(--fs-sm)', color: 'var(--ink-55)', textAlign: 'center' }}>
          Déjà un compte ? <Link to="/login" style={{ fontWeight: 700 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}
