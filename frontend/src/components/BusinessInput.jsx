import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EXAMPLES = [
  { emoji: '🧁', label: 'Home Bakery', text: 'I run a small home bakery in Jaipur. I sell cakes through Instagram and make around ₹30,000 per month.' },
  { emoji: '✂️', label: 'Tailoring', text: 'I run a small tailoring business from home, mostly stitching clothes for neighbours.' },
  { emoji: '🛍️', label: 'Retail Shop', text: 'I run a small retail shop selling groceries and household items.' },
  { emoji: '🍲', label: 'Street Food', text: 'I run a street food stall selling snacks in the evenings.' },
  { emoji: '🎨', label: 'Handmade Products', text: 'I make and sell handmade jewelry and craft items online.' },
]

const STATES = [
  'Rajasthan', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
  'West Bengal', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana', 'Other',
]

export default function BusinessInput({ onAnalyze }) {
  const [description, setDescription] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [location, setLocation] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [employees, setEmployees] = useState('')
  const [mode, setMode] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!description.trim()) return
    onAnalyze({
      description: description.trim(),
      overrides: {
        location: location || null,
        monthlyRevenue: monthlyRevenue ? parseInt(monthlyRevenue, 10) : null,
        employees: employees || null,
        mode: mode || null,
      },
    })
  }

  return (
    <div className="card p-7 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tell us about your business.</h1>
      <p className="text-charcoal/60 mb-7">No tax jargon needed. Just describe what you do.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          className="input-field min-h-[140px] resize-y text-[16px] leading-relaxed"
          placeholder="I run a small home bakery in Jaipur. I sell cakes through Instagram and make around ₹30,000 per month."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-4">
          <p className="text-sm font-semibold text-charcoal/70 mb-2.5">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                key={ex.label}
                onClick={() => setDescription(ex.text)}
                className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal/75 hover:border-emerald-400 hover:text-emerald-700 hover:bg-mint transition-colors"
              >
                {ex.emoji} {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-charcoal/8 pt-5">
          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5"
          >
            Add a few details for a better result
            <span className={`transition-transform ${showOptional ? 'rotate-45' : ''}`}>+</span>
          </button>

          <AnimatePresence>
            {showOptional && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 gap-4 pt-5">
                  <div>
                    <label className="label-text">Location</label>
                    <select className="input-field" value={location} onChange={(e) => setLocation(e.target.value)}>
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Monthly revenue</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="₹ 30,000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-text">Employees</label>
                    <div className="flex gap-2">
                      {['0', '1–5', '6–10', '10+'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setEmployees(opt)}
                          className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                            employees === opt
                              ? 'border-emerald-500 bg-mint text-emerald-700'
                              : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Business mode</label>
                    <div className="flex gap-2">
                      {['Online', 'Offline', 'Both'].map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setMode(opt)}
                          className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                            mode === opt
                              ? 'border-emerald-500 bg-mint text-emerald-700'
                              : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" disabled={!description.trim()} className="btn-primary w-full mt-7">
          Analyze My Business →
        </button>
      </form>
    </div>
  )
}
