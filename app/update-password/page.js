'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createSupabaseBrowserClient } from '@/lib/auth/supabase-browser'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, startSavingTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    if (password.length < 6) {
      setError('Use a password with at least 6 characters.')
      setMessage('')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setMessage('')
      return
    }

    startSavingTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        })

        if (updateError) {
          throw updateError
        }

        setMessage('Your password has been updated. You can sign in with the new password now.')
        setError('')
        router.replace('/login')
      } catch (updateError) {
        setError(updateError instanceof Error ? updateError.message : 'Could not update your password.')
        setMessage('')
      }
    })
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#2155ff_0%,#0f172a_58%,#020617_100%)] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.2)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Password Reset</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl">Choose a new password</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
            Once your reset code is verified, set a new password here and continue back into your account.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-700">New Password</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-slate-950">Reset your password</h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-700">
              New password
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter a new password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-20 outline-none transition focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-slate-950"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <label className="grid gap-2 text-sm text-slate-700">
              Confirm password
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat the new password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-20 outline-none transition focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-slate-950"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="interactive-button inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 hover:shadow-[0_16px_36px_rgba(37,99,235,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Updating password...' : 'Save new password'}
            </button>
          </form>

          <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            If password reset emails in Supabase are configured to use a recovery code, verify that code first. If they are configured to use a recovery link, opening the link signs the user into this page so the new password can be saved safely.
          </div>

          <div className="mt-5 text-sm text-slate-500">
            <Link href="/login" className="transition hover:text-slate-950">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
