// The recurring "signature" visual: a segmented ring made of the five
// profile fields, filling in as information is understood. Used on the
// input screen, the information check, and the results profile card so
// the user always sees the same visual language for "how much we know."
export default function CompletenessRing({ percent, size = 64, strokeWidth = 6, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  const color = percent >= 80 ? '#1F7A45' : percent >= 40 ? '#C6821A' : '#8A8378'

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#EFEAE0" strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-bold text-charcoal" style={{ fontSize: size * 0.26 }}>
            {percent}%
          </span>
        </div>
      </div>
      {label && <span className="text-sm text-charcoal/70 font-medium">{label}</span>}
    </div>
  )
}
