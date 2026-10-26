import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import {
  findProfileByEmail, loginAccount, logoutAccount, registerAccount,
} from '../services/firebaseService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const registering = useRef(false)

  const loadProfile = useCallback(async (email) => {
    const p = await findProfileByEmail(email)
    if (p?.suspended) {
      await logoutAccount()
      setProfile(null)
      throw new Error('บัญชีนี้ถูกระงับการใช้งาน')
    }
    setProfile(p)
    return p
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (registering.current) return
      try {
        if (user) await loadProfile(user.email)
        else setProfile(null)
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
    return unsub
  }, [loadProfile])

  const login = async (email, password) => {
    const cred = await loginAccount(email, password)
    const p = await loadProfile(cred.user.email)
    if (!p) throw new Error('ไม่พบโปรไฟล์ผู้ใช้ในระบบ')
    return p
  }

  const register = async (data) => {
    registering.current = true
    try {
      const user = await registerAccount(data)
      return await loadProfile(user.email)
    } finally {
      registering.current = false
    }
  }

  const logout = async () => {
    await logoutAccount()
    setProfile(null)
  }

  const refreshProfile = () => (auth.currentUser ? loadProfile(auth.currentUser.email) : null)

  return (
    <AuthContext.Provider value={{ profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
