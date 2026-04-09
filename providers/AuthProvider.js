'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/auth/supabase-browser'

const AuthContext = createContext(null)

async function syncUserSession(session) {
  if (!session?.access_token) {
    return
  }

  await fetch('/api/auth/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      provider: session.user?.app_metadata?.provider,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    }),
  })
}

async function removeUserSession(session) {
  if (!session?.access_token) {
    return
  }

  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  })
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    async function bootstrap() {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(currentSession)
        setUser(currentSession?.user || null)

        if (currentSession) {
          await syncUserSession(currentSession)
        }
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : 'Could not restore your login session.')
      } finally {
        setLoading(false)
      }
    }

    bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user || null)

      if (nextSession) {
        await syncUserSession(nextSession)
      }

      if (event === 'SIGNED_OUT') {
        setAuthError('')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function refreshUser() {
    const supabase = createSupabaseBrowserClient()
    const {
      data: { session: nextSession },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    setSession(nextSession)
    setUser(nextSession?.user || null)

    if (nextSession) {
      await syncUserSession(nextSession)
    }

    return nextSession?.user || null
  }

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      authError,
      refreshUser,
      async signOut() {
        const supabase = createSupabaseBrowserClient()
        const activeSession = session

        await removeUserSession(activeSession)
        await supabase.auth.signOut()
        setSession(null)
        setUser(null)
      },
    }),
    [authError, loading, session, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
