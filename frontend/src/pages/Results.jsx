import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Disclaimer from '../components/Disclaimer'
import BusinessProfile from '../components/BusinessProfile'
import FormalizationPath from '../components/FormalizationPath'
import ComplianceCard from '../components/ComplianceCard'
import TaxSummary from '../components/TaxSummary'
import BenefitCard from '../components/BenefitCard'
import BenefitModal from '../components/BenefitModal'
import ActionPlan from '../components/ActionPlan'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Results() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [activeBenefit, setActiveBenefit] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('formalease_result')
    if (!raw) {
      navigate('/analyze')
      return
    }
    setResult(JSON.parse(raw))
  }, [navigate])

  if (!result) return null

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-6">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <h1 className="text-3xl font-bold mb-1">Here&rsquo;s what we understood.</h1>
          <p className="text-charcoal/55">Based on the information you provided</p>
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <BusinessProfile profile={result.profile} completeness={result.completeness} quality={result.quality} />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <FormalizationPath steps={result.formalizationPath} />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <ComplianceCard items={result.compliance} />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <TaxSummary summary={result.obligationSummary} />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="card p-7 sm:p-9 bg-emerald-700 text-canvas">
          <h2 className="text-xl font-bold mb-2">What this means for you</h2>
          <p className="text-emerald-50/90 leading-relaxed">{result.whatThisMeans}</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-xl font-bold mb-1.5">Formalization can unlock more than compliance.</h2>
          <p className="text-charcoal/55 mb-5 text-sm">Here are opportunities that may be relevant to your business.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {result.benefits.map((b) => (
              <BenefitCard key={b.key} benefit={b} onClick={setActiveBenefit} />
            ))}
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <ActionPlan steps={result.actionPlan} />
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Formalization shouldn&rsquo;t feel complicated.</h2>
          <p className="text-charcoal/55 mb-6">We turn complex compliance information into clear decisions.</p>
          <Link to="/analyze" className="btn-primary">Analyze Another Business</Link>
        </motion.div>

        <Disclaimer />
      </main>

      <BenefitModal benefit={activeBenefit} onClose={() => setActiveBenefit(null)} />
    </div>
  )
}
