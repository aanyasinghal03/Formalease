import { motion, AnimatePresence } from 'framer-motion'

export default function BenefitModal({ benefit, onClose }) {
  return (
    <AnimatePresence>
      {benefit && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-7 sm:p-8 shadow-cardHover"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{benefit.icon}</span>
              <button onClick={onClose} aria-label="Close" className="text-charcoal/40 hover:text-charcoal text-xl leading-none">✕</button>
            </div>
            <h3 className="text-xl font-bold mb-1">{benefit.title}</h3>
            <span className="badge badge-good mb-4">{benefit.badge}</span>
            <p className="text-charcoal/70 text-[15px] leading-relaxed mb-5">{benefit.description}</p>

            <div className="mb-5">
              <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5">Basic eligibility</p>
              <p className="text-sm text-charcoal/75 leading-relaxed">{benefit.eligibility}</p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1.5">Official source</p>
              <p className="text-sm text-charcoal/75">{benefit.source}</p>
            </div>

            <button className="btn-primary w-full">Check Official Eligibility →</button>
            <p className="text-xs text-charcoal/45 text-center mt-3">Check official eligibility before applying.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
