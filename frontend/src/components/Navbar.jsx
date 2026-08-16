import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const APP_NAME = 'FormalEase'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur border-b border-charcoal/8">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-display font-bold text-lg text-charcoal">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-canvas text-sm">F</span>
          {APP_NAME}
        </Link>

        {user ? (
          <>
            <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-charcoal/70">
              <Link to="/dashboard" className="hover:text-charcoal transition-colors">Dashboard</Link>
              <Link to="/analyze" className="hover:text-charcoal transition-colors">My Analysis</Link>
              <a href="/dashboard#how-it-works" className="hover:text-charcoal transition-colors">How It Works</a>
            </nav>
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-charcoal/5 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-display font-semibold flex items-center justify-center text-sm">
                  {initial}
                </span>
                <span className="text-sm font-medium text-charcoal/80">{user.displayName || 'Account'}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 card p-2" onMouseLeave={() => setProfileOpen(false)}>
                  <div className="px-3 py-2 text-sm text-charcoal/60 truncate border-b border-charcoal/8 mb-1">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
              <div className="w-5 h-0.5 bg-charcoal mb-1.5" />
              <div className="w-5 h-0.5 bg-charcoal mb-1.5" />
              <div className="w-5 h-0.5 bg-charcoal" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline text-[15px] font-medium text-charcoal/75 hover:text-charcoal">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary !px-5 !py-2.5 text-sm">
              Get Started
            </Link>
          </div>
        )}
      </div>

      {user && menuOpen && (
        <div className="md:hidden border-t border-charcoal/8 px-5 py-4 flex flex-col gap-3 text-[15px] font-medium text-charcoal/80">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/analyze" onClick={() => setMenuOpen(false)}>My Analysis</Link>
          <button onClick={handleLogout} className="text-left text-red-600">Log out</button>
        </div>
      )}
    </header>
  )
}
