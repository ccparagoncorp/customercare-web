"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient, User } from '@/lib/auth-client'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const currentUser = await authClient.getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    getInitialUser()

    // Listen for auth state changes
    const { data: { subscription } } = authClient.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, error } = await authClient.login(email, password)
      
      if (error) {
        return { success: false, error }
      }

      setUser(loggedInUser)
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'set' }),
        })
      } catch {}
      return { success: true }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const logout = async () => {
    await authClient.logout()
    setUser(null)
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      })
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
