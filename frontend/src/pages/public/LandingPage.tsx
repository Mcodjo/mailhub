import { Link } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'

export function LandingPage() {
  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <header className="pub-nav">
        <div className="pub-nav-inner">
          <Link to="/" aria-label="Domial"><Logo height={24} /></Link>
          <nav className="pub-nav-links">
            <a href="#features">Fonctionnalités</a>
            <Link to="/pricing">Tarifs</Link>
            <Link to="/login">Connexion</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Créer mon compte</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="pub-hero">
          <h1>Votre adresse mail pro,<br /><span className="accent">depuis votre domaine.</span></h1>
          <p className="pub-hero-sub">
            Domial connecte votre domaine à Gmail en 10 minutes. Configuration DNS automatique, alias illimités, zéro serveur à gérer.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">Configurer mon domaine</Link>
            <Link to="/pricing" className="btn btn-ghost btn-lg">$2 / an — voir les détails</Link>
          </div>
          <div className="hero-proof">
            <span className="proof-item">
              <CheckIcon />
              SPF · DKIM · DMARC inclus
            </span>
            <span className="proof-item">
              <CheckIcon />
              Sans carte bancaire
            </span>
            <span className="proof-item">
              <CheckIcon />
              Compatible tous registrars
            </span>
          </div>
        </section>

        {/* ── Transformation visuelle ── */}
        <div className="transform-section">
          <div className="transform-inner">
            <p className="transform-label">La différence que ça fait</p>
            <div className="transform-stack" role="img" aria-label="Transformation d'une adresse Gmail vers une adresse sur votre domaine">
              <div className="email-chip chip-before">thomas.agence2024@gmail.com</div>
              <div className="transform-arrow" aria-hidden="true">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <path d="M2 8h16M13 2l7 6-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="email-chip chip-after">
                <span className="local">contact</span>
                <span className="at">@</span>
                <span className="domain">lumen-agence.fr</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Chiffres ── */}
        <div className="stats-band" role="list">
          <div className="stat" role="listitem">
            <div className="stat-num">10 min</div>
            <div className="stat-label">Configuration complète</div>
          </div>
          <div className="stat" role="listitem">
            <div className="stat-num">$2</div>
            <div className="stat-label">Par an, tout inclus</div>
          </div>
          <div className="stat" role="listitem">
            <div className="stat-num">∞</div>
            <div className="stat-label">Alias par domaine</div>
          </div>
        </div>

        {/* ── Fonctionnalités ── */}
        <section className="features-section" id="features">
          <div className="features-inner">
            <p className="section-ey">Ce que vous obtenez</p>
            <h2>Tout le nécessaire, rien de trop.</h2>
            <div className="features-grid">
              <div className="feat-card">
                <div className="feat-icon" style={{ background: '#EEF3FB' }}>
                  <svg width="20" height="20" stroke="#5B84C4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3 4 7v6c0 5 8 8 8 8s8-3 8-8V7z"/></svg>
                </div>
                <h3>Délivrabilité assurée</h3>
                <p>SPF, DKIM et DMARC configurés automatiquement. Vos mails arrivent en boîte de réception, pas en spam.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon" style={{ background: '#EAF4EF' }}>
                  <svg width="20" height="20" stroke="#2E6B52" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 8h16v12H4z"/><path d="m4 8 8 6 8-6"/></svg>
                </div>
                <h3>Alias illimités</h3>
                <p>contact@, devis@, prenom@ — créez autant d'adresses que vous voulez sur votre domaine.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon" style={{ background: '#FBF4E3' }}>
                  <svg width="20" height="20" stroke="#8A6414" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <h3>Votre Gmail, inchangé</h3>
                <p>Envoyez et recevez depuis votre Gmail habituel. Aucune migration, aucun nouvel outil à apprendre.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon" style={{ background: 'var(--steel-soft)' }}>
                  <svg width="20" height="20" stroke="#5B84C4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>
                </div>
                <h3>Tous registrars</h3>
                <p>OVH, Namecheap, Gandi, Cloudflare… Domial détecte votre registrar et guide l'ajout des enregistrements.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon" style={{ background: '#EAF4EF' }}>
                  <svg width="20" height="20" stroke="#2E6B52" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <h3>Vérification en direct</h3>
                <p>Domial surveille la propagation DNS et vous confirme que chaque enregistrement est actif avant d'activer vos boîtes.</p>
              </div>
              <div className="feat-card">
                <div className="feat-icon" style={{ background: 'var(--gray)' }}>
                  <svg width="20" height="20" stroke="var(--ink)" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
                <h3>Tableau de bord clair</h3>
                <p>Gérez vos alias, surveillez votre délivrabilité et ajoutez des domaines depuis une interface simple et épurée.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bloc alterné 1 : wizard DNS ── */}
        <section>
          <div className="alt-block">
            <div className="alt-text">
              <p className="section-ey">Wizard guidé</p>
              <h2>La technique, on s'en occupe.</h2>
              <p>DNS, SPF, DKIM, DMARC — vous n'avez pas besoin de savoir ce que ça veut dire. Domial vérifie chaque enregistrement en temps réel et vous dit exactement quoi copier-coller chez votre registrar.</p>
              <Link to="/register" className="btn btn-ghost">Voir le wizard →</Link>
            </div>
            <div className="alt-visual">
              <div className={`lp-dns-row lp-dns-row-ok`}>
                <span className="lp-dns-type">MX</span>
                <span className="lp-dns-val">aspmx.l.google.com</span>
                <span className="lp-dns-dot" style={{ background: 'var(--success)' }} />
              </div>
              <div className="lp-dns-row lp-dns-row-ok">
                <span className="lp-dns-type">TXT</span>
                <span className="lp-dns-val">v=spf1 include:_spf.google.com ~all</span>
                <span className="lp-dns-dot" style={{ background: 'var(--success)' }} />
              </div>
              <div className="lp-dns-row lp-dns-row-ok">
                <span className="lp-dns-type">CNAME</span>
                <span className="lp-dns-val">google._domainkey.lumen-agence.fr</span>
                <span className="lp-dns-dot" style={{ background: 'var(--success)' }} />
              </div>
              <div className="lp-dns-row lp-dns-row-wait">
                <span className="lp-dns-type">TXT</span>
                <span className="lp-dns-val">v=DMARC1; p=none; rua=mailto:…</span>
                <span className="lp-dns-dot" style={{ background: 'var(--gray-mid)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Bloc alterné 2 : alias ── */}
        <section>
          <div className="alt-block reverse">
            <div className="alt-text">
              <p className="section-ey">Alias illimités</p>
              <h2>Une adresse pour chaque usage.</h2>
              <p>Créez autant d'alias que nécessaire depuis votre tableau de bord. Chaque alias est un canal séparé dans votre Gmail — facile à identifier, facile à filtrer.</p>
              <Link to="/register" className="btn btn-ghost">Créer mes alias →</Link>
            </div>
            <div className="alt-visual">
              <div className="alias-list">
                <div className="alias-row">
                  <span className="alias-dot" style={{ background: '#5B84C4' }} />
                  <span className="alias-addr">contact@lumen-agence.fr</span>
                  <span className="alias-badge">Actif</span>
                </div>
                <div className="alias-row">
                  <span className="alias-dot" style={{ background: '#2E6B52' }} />
                  <span className="alias-addr">devis@lumen-agence.fr</span>
                  <span className="alias-badge">Actif</span>
                </div>
                <div className="alias-row">
                  <span className="alias-dot" style={{ background: '#8A6414' }} />
                  <span className="alias-addr">thomas@lumen-agence.fr</span>
                  <span className="alias-badge">Actif</span>
                </div>
                <div className="alias-row" style={{ opacity: .4, borderStyle: 'dashed' }}>
                  <span className="alias-dot" style={{ background: 'var(--gray-mid)' }} />
                  <span className="alias-addr" style={{ color: 'var(--ink-30)' }}>support@lumen-agence.fr</span>
                  <span className="alias-badge" style={{ background: 'var(--gray)', color: 'var(--ink-55)' }}>+ Ajouter</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="cta-band">
          <h2>Votre adresse mail pro<br />vous attend.</h2>
          <p>$2 par an. 10 minutes. Zéro serveur à gérer.</p>
          <div className="cta-row">
            <Link to="/register" className="btn btn-primary btn-lg">Commencer maintenant</Link>
            <Link to="/pricing" className="btn btn-ghost btn-lg">Voir les tarifs</Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="pub-footer">
        <div className="pub-footer-brand">
          <Logo height={20} inverted />
          <span>© 2026</span>
        </div>
        <div className="pub-footer-links">
          <Link to="/pricing">Tarifs</Link>
          <a href="#features">Fonctionnalités</a>
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="mailto:support@domial.fr">support@domial.fr</a>
        </div>
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
