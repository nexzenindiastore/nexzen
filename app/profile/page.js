'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

function getInitials(name, email) {
  const source = `${name || email || 'Nexzen User'}`.trim()
  const parts = source.split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('')
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, refreshUser } = useAuth()
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, router, user])

  useEffect(() => {
    setFullName(user?.user_metadata?.full_name || user?.user_metadata?.name || '')
  }, [user])

  async function handleProfileSave(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          name: fullName.trim(),
        },
      })

      if (updateError) {
        throw updateError
      }

      await refreshUser()
      setMessage('Profile updated successfully.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update your profile.')
    } finally {
      setSaving(false)
    }
  }

  async function sendResetEmail() {
    if (!user?.email) {
      return
    }

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/login`,
      })

      if (resetError) {
        throw resetError
      }

      setMessage('Password reset email sent. Check your inbox.')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Could not send password reset email.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </section>
    )
  }

  const displayName = fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Nexzen User'
  const provider = `${user.app_metadata?.provider || 'email'}`.replace('_oidc', '')

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#2155ff_0%,#0f172a_58%,#020617_100%)] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.2)]">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Your Profile</p>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl font-semibold">
              {getInitials(displayName, user.email)}
            </div>
            <div>
              <h1 className="font-heading text-4xl font-semibold">{displayName}</h1>
              <p className="mt-2 text-base text-slate-200">{user.email}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/60">
                Signed in with {provider}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleProfileSave}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)]"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Update Profile</p>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm text-slate-700">
                Full name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Your full name"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-700">
                Email
                <input
                  type="email"
                  value={user.email || ''}
                  readOnly
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                />
              </label>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="interactive-button inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={sendResetEmail}
                disabled={saving}
                className="interactive-button inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset password
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Account Tools</p>
            <div className="mt-6 space-y-3">
              <Link
                href="/products"
                className="interactive-button flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>Continue shopping</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/cart"
                className="interactive-button flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>Open cart</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
