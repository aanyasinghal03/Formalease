import CompletenessRing from './CompletenessRing'

function formatINR(amount) {
  if (amount === null || amount === undefined) return '—'
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function BusinessProfile({ profile, completeness, quality }) {
  const qualityBadgeClass = quality.level === 'Good' ? 'badge-good' : quality.level === 'Indicative' ? 'badge-check' : 'badge-neutral'

  return (
    <div className="card p-7 sm:p-9">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{profile.emoji}</span>
          <div>
            <h2 className="text-2xl font-bold">{profile.businessType}</h2>
            <p className="text-charcoal/55">{profile.businessCategory}</p>
          </div>
        </div>
        <CompletenessRing percent={completeness.percent} size={60} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-charcoal/45 uppercase tracking-wide mb-1">Location</p>
          <p className="font-medium">{profile.location}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal/45 uppercase tracking-wide mb-1">Monthly revenue</p>
          <p className="font-medium">{formatINR(profile.monthlyRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal/45 uppercase tracking-wide mb-1">Annual turnover (est.)</p>
          <p className="font-medium">{formatINR(profile.annualRevenue)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal/45 uppercase tracking-wide mb-1">Employees</p>
          <p className="font-medium">{profile.employees ?? '—'}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-charcoal/8">
        <span className={`badge ${qualityBadgeClass}`}>Result quality: {quality.level}</span>
        <span className="text-sm text-charcoal/55">{quality.explanation}</span>
      </div>
    </div>
  )
}
