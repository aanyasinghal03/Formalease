const STATUS_CLASS = {
  'Likely Relevant': 'badge-good',
  'Check Applicability': 'badge-check',
  'Depends on Income': 'badge-neutral',
}

export default function ComplianceCard({ items }) {
  return (
    <div className="card p-7 sm:p-9">
      <h2 className="text-xl font-bold mb-1.5">Your compliance, explained simply.</h2>
      <p className="text-charcoal/55 mb-6 text-sm">No complicated legal terminology — just what may apply.</p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-xl border border-charcoal/8 p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="font-semibold">{item.title}</h3>
              <span className={`badge ${STATUS_CLASS[item.status] || 'badge-neutral'}`}>{item.status}</span>
            </div>
            <p className="text-sm text-charcoal/60 leading-relaxed">{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
