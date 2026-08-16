import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { EmptyStateIllustration } from '../components/Illustrations'
import { useAuth } from '../auth/AuthContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = (user?.displayName || '').split(' ')[0]

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-1.5">
            {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-charcoal/60 text-lg mb-10">Let&rsquo;s make your business easier to understand.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card p-10 sm:p-14 flex flex-col items-center text-center"
        >
          <EmptyStateIllustration className="w-52 mb-6" />
          <h2 className="text-xl font-bold mb-2">Your business profile starts here.</h2>
          <p className="text-charcoal/60 max-w-sm mb-7">
            Tell us what you do and we&rsquo;ll help you understand the formalization path.
          </p>
          <Link to="/analyze" className="btn-primary">Describe My Business</Link>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5 mt-8">
          <Link to="/analyze" className="card p-6 hover:shadow-cardHover transition-shadow">
            <div className="text-2xl mb-3">📝</div>
            <h3 className="font-bold mb-1">Analyze My Business</h3>
            <p className="text-sm text-charcoal/55">Start a new business description.</p>
          </Link>
          <div className="card p-6 opacity-60">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-bold mb-1">My Analysis</h3>
            <p className="text-sm text-charcoal/55">No analyses yet.</p>
          </div>
          <div className="card p-6 opacity-60">
            <div className="text-2xl mb-3">🏛</div>
            <h3 className="font-bold mb-1">Benefits</h3>
            <p className="text-sm text-charcoal/55">Analyze a business to see matches.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
