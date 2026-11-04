interface LogoProps {
  height?: number
  inverted?: boolean
}

export function Logo({ height = 28, inverted = false }: LogoProps) {
  const ink = inverted ? '#fff' : '#16233B'
  const steel = '#5B84C4'
  return (
    <svg height={height} viewBox="0 0 110 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Domial">
      {/* Icône enveloppe stylisée */}
      <rect x="1" y="4" width="22" height="16" rx="3" stroke={steel} strokeWidth="2" fill="none"/>
      <path d="M1 7l11 8 11-8" stroke={steel} strokeWidth="2" strokeLinecap="round"/>
      {/* Point domaine */}
      <circle cx="11" cy="22" r="2" fill={steel}/>
      {/* Texte Domial */}
      <text x="30" y="20" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="700" fontSize="15" fill={ink} letterSpacing="-0.5">
        Domial
      </text>
    </svg>
  )
}
