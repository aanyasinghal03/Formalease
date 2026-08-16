// Minimal, cohesive vector illustrations kept as inline SVG — no external
// image assets, so the app stays fast and the palette always matches.

export function HeroIllustration({ className }) {
  return (
    <svg viewBox="0 0 420 380" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="210" cy="190" r="170" fill="#E4F4EA" />
      {/* storefront */}
      <rect x="95" y="170" width="150" height="110" rx="6" fill="#FAF8F3" stroke="#0F4C2C" strokeWidth="2.5" />
      <rect x="95" y="150" width="150" height="26" rx="4" fill="#1F7A45" />
      <rect x="150" y="215" width="40" height="65" rx="2" fill="#EAF6EE" stroke="#0F4C2C" strokeWidth="2" />
      <rect x="110" y="195" width="26" height="26" rx="2" fill="#EAF6EE" stroke="#0F4C2C" strokeWidth="2" />
      <rect x="200" y="195" width="26" height="26" rx="2" fill="#EAF6EE" stroke="#0F4C2C" strokeWidth="2" />
      {/* document */}
      <g transform="translate(255,90)">
        <rect x="0" y="0" width="90" height="112" rx="8" fill="#FFFFFF" stroke="#0F4C2C" strokeWidth="2.5" />
        <line x1="16" y1="26" x2="74" y2="26" stroke="#1F7A45" strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="42" x2="74" y2="42" stroke="#A6DDB8" strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="58" x2="60" y2="58" stroke="#A6DDB8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="45" cy="90" r="16" fill="#1F7A45" />
        <path d="M38 90 L43 96 L54 82" stroke="#FAF8F3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* growth arrow */}
      <g transform="translate(55,60)">
        <path d="M0 70 L30 40 L52 58 L90 12" stroke="#166238" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 12 L90 12 L90 34" stroke="#166238" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* small figure */}
      <circle cx="130" cy="300" r="14" fill="#0F4C2C" />
      <path d="M130 314 C110 320 106 345 106 345 L154 345 C154 345 150 320 130 314 Z" fill="#0F4C2C" />
    </svg>
  )
}

export function EmptyStateIllustration({ className }) {
  return (
    <svg viewBox="0 0 260 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="130" cy="175" rx="100" ry="12" fill="#EFEAE0" />
      <rect x="55" y="70" width="150" height="95" rx="8" fill="#FFFFFF" stroke="#0F4C2C" strokeWidth="2.5" />
      <rect x="55" y="55" width="150" height="24" rx="4" fill="#1F7A45" />
      <circle cx="130" cy="118" r="22" fill="#EAF6EE" stroke="#166238" strokeWidth="2" />
      <path d="M120 118 L127 125 L141 108" stroke="#166238" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="90" y="145" width="80" height="8" rx="4" fill="#EFEAE0" />
    </svg>
  )
}

export function AuthSideIllustration({ className }) {
  return (
    <svg viewBox="0 0 320 380" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="320" height="380" fill="none" />
      <circle cx="160" cy="180" r="140" fill="rgba(255,255,255,0.08)" />
      <rect x="90" y="150" width="140" height="100" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      <line x1="106" y1="176" x2="200" y2="176" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
      <line x1="106" y1="192" x2="185" y2="192" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      <line x1="106" y1="208" x2="160" y2="208" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="190" cy="228" r="14" fill="#EAF6EE" />
      <path d="M184 228 L188 233 L197 222" stroke="#166238" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 260 L95 220 L118 240 L160 190" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
