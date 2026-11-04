import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'

const STEPS = [
  {
    num: '01',
    title: 'Ajoutez votre domaine',
    desc: 'Entrez le nom de domaine depuis lequel vous souhaitez recevoir et envoyer des emails.',
  },
  {
    num: '02',
    title: 'Configurez les DNS',
    desc: 'Ajoutez les enregistrements MX, SPF et DMARC fournis par Domial dans votre gestionnaire DNS.',
  },
  {
    num: '03',
    title: 'Connectez Gmail',
    desc: 'Autorisez l\'envoi depuis votre compte Gmail pour transmettre les emails via votre adresse pro.',
  },
  {
    num: '04',
    title: 'Activez votre domaine',
    desc: 'Une fois tout configuré, activez le domaine et commencez à recevoir vos emails.',
  },
]

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--s7) var(--s5)' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: 'var(--s6)' }}>
          <Logo height={36} />
        </div>

        <h1 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--s3)' }}>
          Bienvenue sur Domial
        </h1>
        <p style={{ color: 'var(--ink-55)', fontSize: 'var(--fs-base)', marginBottom: 'var(--s7)' }}>
          En quelques minutes, votre adresse mail professionnelle sera prête.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', marginBottom: 'var(--s7)', textAlign: 'left' }}>
          {STEPS.map((s) => (
            <div key={s.num} style={{ display: 'flex', gap: 'var(--s4)', background: 'var(--white)', border: 'var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--s4) var(--s5)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--steel-soft)', color: 'var(--steel)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 'var(--fs-xs)', flex: 'none' }}>
                {s.num}
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--ink-55)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigate('/app/wizard')}
        >
          Commencer la configuration →
        </button>

        <button
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 'var(--s3)', width: '100%' }}
          onClick={() => navigate('/app/inbox')}
        >
          Passer pour l'instant
        </button>
      </div>
    </div>
  )
}
