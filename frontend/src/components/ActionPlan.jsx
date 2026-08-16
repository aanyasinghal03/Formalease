export default function ActionPlan({ steps }) {
  return (
    <div className="card p-7 sm:p-9">
      <h2 className="text-xl font-bold mb-6">Your next 3 steps</h2>
      <div className="space-y-5">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-4">
            <span className="shrink-0 w-9 h-9 rounded-full bg-emerald-600 text-canvas font-display font-bold flex items-center justify-center text-sm">
              {String(s.step).padStart(2, '0')}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold">{s.title}</h3>
                <span className={`badge ${s.status === 'Recommended' ? 'badge-good' : 'badge-neutral'} !py-0.5`}>{s.status}</span>
              </div>
              <p className="text-sm text-charcoal/60">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
