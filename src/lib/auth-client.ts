import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  role: string
  category: string
}

export class AuthClient {
  private static instance: AuthClient
  
  static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient()
    }
    return AuthClient.instance
  }

  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return { user: null, error: "Authentication service not configured" }
      }

      // Use Supabase client-side auth (more secure)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: "Invalid credentials" }
      }

      if (!data.user) {
        return { user: null, error: "Authentication failed" }
      }

      // Get user metadata from session
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email,
        role: "agent",
        category: data.user.user_metadata?.category || "socialMedia"
      }

      return { user, error: null }
    } catch (error) {
      console.error("Login error:", error)
      return { user: null, error: "Authentication failed" }
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.email || "",
        role: "agent",
        category: user.user_metadata?.category || "socialMedia"
      }
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email || "",
          role: "agent",
          category: session.user.user_metadata?.category || "socialMedia"
        }
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authClient = AuthClient.getInstance()
