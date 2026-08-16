import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { friendlyAuthError } from '../auth/authErrors'
import { AuthSideIllustration } from '../components/Illustrations'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
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
          <h2 className="text-3xl font-bold leading-tight mb-3">Understand your taxes.<br />Discover your benefits.</h2>
          <p className="text-emerald-100/90 max-w-sm">
            A friendly digital advisor for small businesses — no jargon, no long forms.
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
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-charcoal/60 mb-8">Continue simplifying your business journey.</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="label-text">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="label-text">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
              {submitting ? 'Logging in…' : 'Log In →'}
            </button>
          </form>

          <p className="text-sm text-charcoal/60 mt-6 text-center">
            Don&rsquo;t have an account?{' '}
            <Link to="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
