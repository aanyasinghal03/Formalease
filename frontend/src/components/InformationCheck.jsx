import { motion } from 'framer-motion'
import CompletenessRing from './CompletenessRing'
import { FIELD_LABELS } from '../data/mockAnalysis'

export default function InformationCheck({ fields, completeness, onAddDetails, onContinueIndicative }) {
  const fieldOrder = ['businessType', 'businessCategory', 'location', 'monthlyRevenue', 'employees']

  let levelMessage = ''
  if (completeness.percent >= 80) {
    levelMessage = 'Great! We have enough information to personalize your result.'
  } else if (completeness.percent >= 40) {
    levelMessage = `Add ${completeness.missing.length} more detail${completeness.missing.length === 1 ? '' : 's'} for a more relevant result.`
  } else {
    levelMessage = 'We can give you an indicative result.'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-7 sm:p-10"
    >
      <h2 className="text-2xl font-bold mb-1">Before we calculate anything…</h2>
      <p className="text-charcoal/60 mb-7">Here&rsquo;s what we found in your description.</p>

      <div className="flex items-center gap-5 mb-7 p-5 rounded-xl bg-sand/50">
        <CompletenessRing percent={completeness.percent} size={72} />
        <div>
          <p className="font-display font-bold text-charcoal">
            Your profile is {completeness.percent}% complete
          </p>
          <p className="text-sm text-charcoal/60 mt-0.5">
            {completeness.foundCount} of {completeness.totalCount} key details provided
          </p>
        </div>
      </div>

      <ul className="space-y-2.5 mb-7">
        {fieldOrder.map((key) => {
          const found = completeness.found.includes(key)
          return (
            <li key={key} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-white border border-charcoal/8">
              <span className="text-[15px] font-medium text-charcoal/80">{FIELD_LABELS[key]}</span>
              {found ? (
                <span className="badge badge-good">✓ Found</span>
              ) : (
                <span className="badge badge-check">! Missing</span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="rounded-xl bg-mint/70 px-5 py-4 mb-7">
        <p className="font-display font-semibold text-emerald-700 mb-1">We can still help.</p>
        <p className="text-sm text-emerald-800/80 leading-relaxed">{levelMessage}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {completeness.missing.length > 0 && (
          <button onClick={onAddDetails} className="btn-primary flex-1">Add Missing Details</button>
        )}
        <button onClick={onContinueIndicative} className={completeness.missing.length > 0 ? 'btn-secondary flex-1' : 'btn-primary flex-1'}>
          Continue with Indicative Result →
        </button>
      </div>
    </motion.div>
  )
}
