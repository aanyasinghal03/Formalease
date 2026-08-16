import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase persists the session itself — no custom token system needed.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signup(name, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    if (name) {
      await updateProfile(credential.user, { displayName: name })
      // updateProfile doesn't trigger onAuthStateChanged with the new name locally,
      // so reflect it immediately in state.
      setUser({ ...credential.user, displayName: name })
    }
    return credential.user
  }

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  async function logout() {
    await signOut(auth)
  }

  const value = { user, loading, signup, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
