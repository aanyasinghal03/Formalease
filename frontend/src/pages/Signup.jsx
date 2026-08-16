import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { friendlyAuthError } from '../auth/authErrors'
import { AuthSideIllustration } from '../components/Illustrations'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    if (!name.trim()) return 'Tell us your name so we can greet you properly.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "That email address doesn't look right."
    if (password.length < 6) return 'Choose a password with at least 6 characters.'
    if (password !== confirm) return "Those passwords don't match. Give it another try."
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await signup(name.trim(), email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-emerald-700 text-canvas p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg relative z-10">
          <span className="w-7 h-7 rounded-lg bg-canvas/15 flex items-center justify-center text-sm">F</span>
          FormalEase
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight mb-3">Describe your business.<br />We&rsquo;ll explain the rest.</h2>
          <p className="text-emerald-100/90 max-w-sm">
            No tax jargon needed. Just tell us what you do, in your own words.
          </p>
        </div>
        <AuthSideIllustration className="absolute -bottom-10 -right-10 w-80 opacity-90" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-canvas">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold mb-1">Start your formalization journey</h1>
          <p className="text-charcoal/60 mb-8">It takes less than a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="label-text">Name</label>
              <input id="name" type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aanya Sharma" />
            </div>
            <div>
              <label htmlFor="email" className="label-text">Email</label>
              <input id="email" type="email" required autoComplete="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="label-text">Password</label>
              <input id="password" type="password" required autoComplete="new-password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            <div>
              <label htmlFor="confirm" className="label-text">Confirm Password</label>
              <input id="confirm" type="password" required autoComplete="new-password" className="input-field" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </div>

            {error && (
              <div role="alert" className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
              {submitting ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-sm text-charcoal/60 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
