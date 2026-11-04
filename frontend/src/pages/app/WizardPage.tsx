import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { domainsApi } from '../../api/domains'
import { useAppStore } from '../../store/app'
import type { Domain, DnsRecord } from '../../types'
import { Spinner } from '../../components/ui/Spinner'

type Step = 'domain' | 'dns' | 'cloudflare' | 'done'

export function WizardPage() {
  const navigate = useNavigate()
  const { setDomains } = useAppStore()
  const [step, setStep] = useState<Step>('domain')
  const [domain, setDomain] = useState('')
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null)
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])
  const [allVerified, setAllVerified] = useState(false)
  const [cfToken, setCfToken] = useState('')
  const [cfZone, setCfZone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const d = await domainsApi.create(domain)
      setCurrentDomain(d)
      const dns = await domainsApi.dnsRecords(d.id)
      setDnsRecords(dns.records)
      setAllVerified(dns.all_verified)
      setStep('dns')
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de l\'ajout du domaine.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyDns() {
    if (!currentDomain) return
    setLoading(true); setError(null)
    try {
      const dns = await domainsApi.verifyDns(currentDomain.id)
      setDnsRecords(dns.records)
      setAllVerified(dns.all_verified)
    } catch (err: any) {
      setError(err.message ?? 'Erreur de vérification DNS.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConnectCloudflare(e: React.FormEvent) {
    e.preventDefault()
    if (!currentDomain) return
    setLoading(true); setError(null)
    try {
      await domainsApi.connectCloudflare(currentDomain.id, cfToken, cfZone)
      setStep('done')
      const updated = await domainsApi.list()
      setDomains(updated)
    } catch (err: any) {
      setError(err.message ?? 'Erreur de connexion Cloudflare.')
    } finally {
      setLoading(false)
    }
  }

  async function handleActivate() {
    if (!currentDomain) return
    setLoading(true); setError(null)
    try {
      await domainsApi.activate(currentDomain.id)
      const updated = await domainsApi.list()
      setDomains(updated)
      navigate('/app/inbox')
    } catch (err: any) {
      setError(err.message ?? 'Erreur d\'activation.')
    } finally {
      setLoading(false)
    }
  }

  const steps: { id: Step; label: string }[] = [
    { id: 'domain', label: 'Ajouter le domaine' },
    { id: 'dns', label: 'Configurer les DNS' },
    { id: 'cloudflare', label: 'Connecter Cloudflare' },
    { id: 'done', label: 'Activation' },
  ]

  const stepIdx = steps.findIndex((s) => s.id === step)

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--gray)', padding: 'var(--s7) var(--s5)' }}>
      <div className="wiz-layout">
        {/* Stepper */}
        <div className="stepper">
          <div className="stepper-title">Configuration</div>
          <ul className="step-list">
            {steps.map((s, i) => {
              const done = i < stepIdx
              const active = i === stepIdx
              const cls = done ? 'done' : active ? 'active' : ''
              return (
                <li key={s.id} className={`step-li ${cls}`}>
                  <div className="step-dot">
                    {done ? <CheckIcon /> : i + 1}
                  </div>
                  <div className="step-txt">
                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: active ? 700 : 500, color: active ? 'var(--ink)' : done ? 'var(--success)' : 'var(--ink-55)' }}>
                      {s.label}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Panneau principal */}
        <div>
          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--s4)' }}>{error}</div>}

          {step === 'domain' && (
            <div className="card">
              <h2 style={{ marginBottom: 'var(--s2)' }}>Votre domaine</h2>
              <p style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--s5)' }}>
                Entrez le nom de domaine depuis lequel vous souhaitez recevoir et envoyer des emails.
              </p>
              <form onSubmit={handleAddDomain}>
                <div className="field">
                  <label className="field-label">Domaine</label>
                  <input type="text" className="input" value={domain}
                    onChange={(e) => setDomain(e.target.value.toLowerCase())}
                    placeholder="monentreprise.fr" required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Spinner size={16} /> : 'Ajouter le domaine →'}
                </button>
              </form>
            </div>
          )}

          {step === 'dns' && (
            <div>
              <div className="card" style={{ marginBottom: 'var(--s4)' }}>
                <h2 style={{ marginBottom: 'var(--s2)' }}>Enregistrements DNS</h2>
                <p style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--s5)' }}>
                  Ajoutez ces enregistrements dans votre gestionnaire DNS, puis vérifiez.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
                  {dnsRecords.map((r, i) => (
                    <div key={i} className="dns-row">
                      <span className="dns-type">{r.type}</span>
                      <span className="dns-name">{r.name}</span>
                      <span className="dns-value">{r.value}</span>
                      <span className={`dns-status ${r.status === 'ok' ? 'ok' : r.status === 'waiting_cf' ? 'waiting' : 'missing'}`}>
                        {r.status === 'ok' ? '✓' : r.status === 'waiting_cf' ? '⏳' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'var(--s5)', display: 'flex', gap: 'var(--s2)', alignItems: 'center' }}>
                  <button className="btn btn-secondary" onClick={handleVerifyDns} disabled={loading}>
                    {loading ? <Spinner size={16} /> : 'Vérifier les DNS'}
                  </button>
                  {allVerified && (
                    <button className="btn btn-primary" onClick={() => setStep('cloudflare')}>
                      Continuer →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'cloudflare' && (
            <div className="card">
              <h2 style={{ marginBottom: 'var(--s2)' }}>Connecter Cloudflare</h2>
              <p style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--s5)' }}>
                Entrez votre token API Cloudflare (Email Routing activé) et l'ID de zone.
              </p>
              <form onSubmit={handleConnectCloudflare}>
                <div className="field">
                  <label className="field-label">Token API Cloudflare</label>
                  <input type="password" className="input" value={cfToken}
                    onChange={(e) => setCfToken(e.target.value)}
                    placeholder="Votre token Cloudflare" required />
                </div>
                <div className="field">
                  <label className="field-label">Zone ID</label>
                  <input type="text" className="input" value={cfZone}
                    onChange={(e) => setCfZone(e.target.value)}
                    placeholder="a1b2c3d4e5f6…" required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Spinner size={16} /> : 'Connecter →'}
                </button>
              </form>
            </div>
          )}

          {step === 'done' && (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 'var(--s4)' }}>✓</div>
              <h2 style={{ marginBottom: 'var(--s2)' }}>Presque prêt !</h2>
              <p style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--s5)' }}>
                Vérifiez votre alias dans Gmail (Paramètres → Comptes → Envoyer en tant que), puis activez votre domaine.
              </p>
              <button className="btn btn-steel btn-lg" onClick={handleActivate} disabled={loading}>
                {loading ? <Spinner size={16} /> : 'Activer mon domaine'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
