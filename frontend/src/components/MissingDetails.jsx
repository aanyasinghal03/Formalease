import { useState } from 'react'
import { motion } from 'framer-motion'

const STATES = [
  'Rajasthan', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
  'West Bengal', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Punjab', 'Haryana', 'Other',
]

export default function MissingDetails({ missing, onUpdate }) {
  const [location, setLocation] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [employees, setEmployees] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onUpdate({
      location: location || undefined,
      monthlyRevenue: monthlyRevenue ? parseInt(monthlyRevenue, 10) : undefined,
      employees: employees ? parseInt(employees, 10) : undefined,
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card p-7 sm:p-10">
      <h2 className="text-2xl font-bold mb-1">A few more details</h2>
      <p className="text-charcoal/60 mb-7">We only need what&rsquo;s missing — nothing you&rsquo;ve already told us.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {missing.includes('location') && (
          <div>
            <label className="label-text">Where is your business located?</label>
            <select className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} required>
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        {missing.includes('monthlyRevenue') && (
          <div>
            <label className="label-text">Approximately how much do you earn?</label>
            <input
              type="number"
              className="input-field"
              placeholder="₹ Monthly revenue"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              required
            />
          </div>
        )}
        {missing.includes('employees') && (
          <div>
            <label className="label-text">Do you have employees?</label>
            <div className="flex gap-2">
              {['0', '1', '3', '8'].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setEmployees(opt)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                    employees === opt ? 'border-emerald-500 bg-mint text-emerald-700' : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal/30'
                  }`}
                >
                  {opt === '0' ? '0' : opt === '1' ? '1–5' : opt === '3' ? '6–10' : '10+'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full mt-2">Update My Result →</button>
      </form>
    </motion.div>
  )
}
