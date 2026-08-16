import { motion } from 'framer-motion'

const STATUS_STYLES = {
  done: { dot: 'bg-emerald-600', text: 'text-emerald-700', badge: 'badge-good', label: 'Complete' },
  relevant: { dot: 'bg-emerald-500', text: 'text-emerald-700', badge: 'badge-good', label: 'Relevant' },
  check: { dot: 'bg-amber-400', text: 'text-amber-500', badge: 'badge-check', label: 'Check required' },
  upcoming: { dot: 'bg-charcoal/20', text: 'text-charcoal/45', badge: 'badge-neutral', label: 'Upcoming' },
}

export default function FormalizationPath({ steps }) {
  return (
    <div className="card p-7 sm:p-9">
      <h2 className="text-xl font-bold mb-6">Your formalization path</h2>
      <div className="relative pl-2">
        {steps.map((step, i) => {
          const style = STATUS_STYLES[step.status] || STATUS_STYLES.upcoming
          const isLast = i === steps.length - 1
          return (
            <motion.div
              key={step.key}
              className="relative pl-8 pb-8 last:pb-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {!isLast && <span className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-charcoal/10" />}
              <span className={`absolute left-0 top-1 w-4 h-4 rounded-full ${style.dot}`} />
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-charcoal">{step.title}</h3>
                <span className={`badge ${style.badge} !py-0.5`}>{style.label}</span>
              </div>
              <p className="text-sm text-charcoal/55">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
