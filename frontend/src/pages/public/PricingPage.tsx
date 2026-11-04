import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'

const FAQS = [
  {
    q: 'Est-ce que je garde mon Gmail existant ?',
    a: 'Oui. Domial relie vos nouvelles adresses de domaine à votre compte Gmail. Vous envoyez et recevez depuis votre Gmail habituel — avec vos boîtes professionnelles en plus.',
  },
  {
    q: 'Dois-je acheter un domaine via Domial ?',
    a: 'Non. Domial fonctionne avec votre domaine existant, quel que soit votre registrar. Si vous n\'en avez pas encore, Domial vous guide pour en choisir un.',
  },
  {
    q: 'Que se passe-t-il si je ne renouvelle pas ?',
    a: 'Votre tableau de bord Domial est suspendu. Les enregistrements DNS que vous avez configurés chez votre registrar restent en place — ils ne disparaissent pas et vous restent accessibles.',
  },
  {
    q: 'Combien d\'alias puis-je créer ?',
    a: 'Autant que vous voulez. contact@, devis@, prenom@, support@ — il n\'y a aucune limite d\'alias.',
  },
]

export function PricingPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function toggle(i: number) {
    setOpenIdx((prev) => (prev === i ? null : i))
  }

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header className="pub-nav">
        <div className="pub-nav-inner">
          <Link to="/" aria-label="Domial"><Logo height={24} /></Link>
          <nav className="pub-nav-links">
            <Link to="/">Comment ça marche</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Créer mon compte</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <div className="pricing-hero">
          <h1>Un tarif.<br />Tout inclus.</h1>
          <p>Pas de plan basique, pas de plan Pro. Domial fait une chose — bien — et vous la facture honnêtement.</p>
        </div>

        {/* ── Plan unique ── */}
        <section className="plan-section">
          <div className="plan-card">
            <div className="plan-header">
              <p className="plan-name">Domial</p>
              <div className="plan-price"><sup>$</sup>2</div>
              <p className="plan-period">par an</p>
            </div>
            <div className="plan-body">
              <p className="plan-tagline">Tout ce qu'il faut. Rien de superflu.</p>
              <ul className="plan-features" role="list">
                <li>
                  <CheckIcon />
                  <span>Connexion à votre <strong>Gmail existant</strong> — aucun changement d'habitude</span>
                </li>
                <li>
                  <CheckIcon />
                  <span><strong>Alias illimités</strong> sur votre domaine (contact@, devis@, prenom@…)</span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Configuration automatique <strong>SPF · DKIM · DMARC</strong></span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Wizard guidé, compatible <strong>tous registrars</strong> (OVH, Namecheap, Gandi…)</span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Tableau de bord pour gérer vos alias et surveiller la délivrabilité</span>
                </li>
                <li>
                  <CheckIcon />
                  <span>Support par email inclus</span>
                </li>
              </ul>
              <div className="plan-cta-area">
                <Link to="/register" className="btn btn-primary btn-block btn-lg">Commencer — $2 / an</Link>
                <p className="plan-note">
                  Sans carte bancaire pour commencer ·{' '}
                  <Link to="/login">Connexion</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="faq-section">
          <div className="faq-inner">
            <h2>Questions fréquentes</h2>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
                  <div
                    className="faq-q"
                    role="button"
                    tabIndex={0}
                    aria-expanded={openIdx === i}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i) } }}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                  </div>
                  {openIdx === i && (
                    <p className="faq-a">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="pub-footer-simple">
        <span>© 2026 Domial</span>
        <Link to="/">Accueil</Link>
        <a href="#">Mentions légales</a>
        <a href="#">Confidentialité</a>
        <a href="mailto:support@domial.fr">support@domial.fr</a>
      </footer>

    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
