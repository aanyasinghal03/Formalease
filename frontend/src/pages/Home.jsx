import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Disclaimer from '../components/Disclaimer'
import { HeroIllustration } from '../components/Illustrations'

const TRUST_CARDS = [
  { title: 'Understand', desc: 'Know what applies to your business.', icon: '🔍' },
  { title: 'Estimate', desc: 'See an easy-to-understand view of potential obligations.', icon: '🧮' },
  { title: 'Benefit', desc: 'Discover opportunities unlocked through formalization.', icon: '🌱' },
]

const STEPS = [
  { n: '01', title: 'Describe', desc: 'Tell us what you do in your own words.' },
  { n: '02', title: 'Understand', desc: 'We identify your business profile.' },
  { n: '03', title: 'Simplify', desc: 'We translate complex requirements into plain language.' },
  { n: '04', title: 'Discover', desc: 'Find potential benefits and next steps.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
}

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="badge badge-good mb-5">FOR SMALL BUSINESSES • SIMPLIFIED</span>
          <h1 className="text-[2.6rem] sm:text-5xl leading-[1.08] font-extrabold text-charcoal mb-5">
            Your business is already real. Let&rsquo;s make formalization easier.
          </h1>
          <p className="text-lg text-charcoal/65 leading-relaxed mb-8 max-w-md">
            Describe your business in your own words. FormalEase explains the registrations, tax obligations
            and potential benefits that may apply — without the jargon.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/signup" className="btn-primary">Check My Business →</Link>
            <a href="#how-it-works" className="btn-secondary">See How It Works</a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <HeroIllustration className="w-full max-w-md mx-auto" />
        </motion.div>
      </section>

      {/* Trust section */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-t border-charcoal/8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Why FormalEase?</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TRUST_CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              className="card p-7 hover:shadow-cardHover transition-shadow duration-300"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-charcoal/60 text-[15px] leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-5 sm:px-8 py-16 border-t border-charcoal/8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14">How it works</h2>
        <div className="grid sm:grid-cols-4 gap-8 sm:gap-4 relative">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="relative text-center sm:text-left"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
            >
              <div className="font-display text-4xl font-extrabold text-emerald-200 mb-3">{s.n}</div>
              <h3 className="text-lg font-bold mb-1.5">{s.title}</h3>
              <p className="text-charcoal/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center border-t border-charcoal/8">
        <h2 className="text-3xl font-bold mb-4">Describe your business. We&rsquo;ll explain the rest.</h2>
        <Link to="/signup" className="btn-primary mt-2">Get Started →</Link>
      </section>

      <footer className="max-w-6xl mx-auto px-5 sm:px-8 pb-10">
        <Disclaimer />
      </footer>
    </div>
  )
}
