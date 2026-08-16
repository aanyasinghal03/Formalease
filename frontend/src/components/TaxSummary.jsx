import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    function step(ts) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export default function TaxSummary({ summary }) {
  const animated = useCountUp(summary.available ? summary.total : 0)

  if (!summary.available) {
    return (
      <div className="card p-7 sm:p-9 text-center">
        <h2 className="text-xl font-bold mb-2">What might you owe?</h2>
        <p className="text-charcoal/60">We need more information to estimate this.</p>
      </div>
    )
  }

  return (
    <div className="card p-7 sm:p-9">
      <h2 className="text-xl font-bold mb-1">What might you owe?</h2>
      <p className="text-charcoal/50 text-sm mb-6">Illustrative annual estimate</p>

      <motion.p
        className="font-display text-5xl font-extrabold text-emerald-700 mb-1"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        {formatINR(animated)}
      </motion.p>

      <div className="grid sm:grid-cols-3 gap-3 mt-7">
        {summary.breakdown.map((item) => (
          <div key={item.label} className="rounded-xl bg-sand/60 p-4">
            <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1">{item.label}</p>
            <p className="font-display font-bold text-lg">{formatINR(item.value)}</p>
            {item.note && <p className="text-xs text-charcoal/45 mt-0.5">{item.note}</p>}
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal/45 mt-6 leading-relaxed">
        Illustrative prototype estimate — actual liability must be determined using current applicable rules.
      </p>
    </div>
  )
}
