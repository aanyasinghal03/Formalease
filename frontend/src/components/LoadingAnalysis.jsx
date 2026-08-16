import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  'Reading your description',
  'Identifying your business category',
  'Checking applicable requirements',
  'Finding potential benefits',
  'Preparing your action plan',
]

export default function LoadingAnalysis({ onDone }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= STEPS.length) {
      const t = setTimeout(onDone, 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActiveIndex((i) => i + 1), 550)
    return () => clearTimeout(t)
  }, [activeIndex, onDone])

  return (
    <div className="card p-10 sm:p-14 flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold mb-1">Understanding your business</h2>
      <p className="text-charcoal/50 mb-9 text-sm">This takes just a few seconds</p>

      <div className="w-full max-w-sm space-y-3.5">
        {STEPS.map((step, i) => {
          const done = i < activeIndex
          const active = i === activeIndex
          return (
            <div key={step} className="flex items-center gap-3 text-left">
              <span
                className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs transition-colors duration-300 ${
                  done ? 'bg-emerald-600 text-canvas' : active ? 'bg-mint border-2 border-emerald-500' : 'bg-sand'
                }`}
              >
                {done && '✓'}
                {active && (
                  <motion.span
                    className="w-2 h-2 rounded-full bg-emerald-600"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                  />
                )}
              </span>
              <span className={`text-[15px] transition-colors duration-300 ${done ? 'text-charcoal/45 line-through' : active ? 'text-charcoal font-medium' : 'text-charcoal/35'}`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
