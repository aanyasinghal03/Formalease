import { motion } from 'framer-motion'

export default function BenefitCard({ benefit, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(benefit)}
      className="text-left card p-6 hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-200"
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-3xl">{benefit.icon}</span>
      <h3 className="font-bold text-lg mt-3 mb-1.5">{benefit.title}</h3>
      <p className="text-sm text-charcoal/60 leading-relaxed mb-4">{benefit.description}</p>
      <span className="badge badge-good">{benefit.badge}</span>
    </motion.button>
  )
}
