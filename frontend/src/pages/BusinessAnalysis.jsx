import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BusinessInput from '../components/BusinessInput'
import InformationCheck from '../components/InformationCheck'
import MissingDetails from '../components/MissingDetails'
import LoadingAnalysis from '../components/LoadingAnalysis'
import { detectSignals, analyzeBusiness } from '../services/analysisService'
import { computeCompleteness } from '../data/mockAnalysis'

const STEPS = { INPUT: 'input', CHECK: 'check', MISSING: 'missing', LOADING: 'loading' }

export default function BusinessAnalysis() {
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.INPUT)
  const [fields, setFields] = useState(null)

  function handleAnalyze({ description, overrides }) {
    const signals = detectSignals(description)
    const merged = {
      ...signals,
      location: overrides.location || signals.location,
      monthlyRevenue: overrides.monthlyRevenue || signals.monthlyRevenue,
      employees: overrides.employees ? parseEmployeeBucket(overrides.employees) : signals.employees,
      description,
    }
    setFields(merged)
    setStep(STEPS.CHECK)
  }

  function parseEmployeeBucket(bucket) {
    if (typeof bucket === 'number') return bucket
    if (bucket === '0') return 0
    if (bucket === '1–5') return 3
    if (bucket === '6–10') return 8
    if (bucket === '10+') return 12
    return null
  }

  function handleUpdateMissing(updates) {
    setFields((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined)) }))
    setStep(STEPS.LOADING)
  }

  async function handleDoneLoading() {
    const result = await analyzeBusiness(fields)
    sessionStorage.setItem('formalease_result', JSON.stringify(result))
    navigate('/results')
  }

  const completeness = fields ? computeCompleteness(fields) : null

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {step === STEPS.INPUT && <BusinessInput key="input" onAnalyze={handleAnalyze} />}

          {step === STEPS.CHECK && fields && (
            <InformationCheck
              key="check"
              fields={fields}
              completeness={completeness}
              onAddDetails={() => setStep(STEPS.MISSING)}
              onContinueIndicative={() => setStep(STEPS.LOADING)}
            />
          )}

          {step === STEPS.MISSING && (
            <MissingDetails key="missing" missing={completeness.missing} onUpdate={handleUpdateMissing} />
          )}

          {step === STEPS.LOADING && <LoadingAnalysis key="loading" onDone={handleDoneLoading} />}
        </AnimatePresence>
      </main>
    </div>
  )
}
