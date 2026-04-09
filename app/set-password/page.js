'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createSupabaseBrowserClient } from '@/lib/auth/supabase-browser'

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSaving, startSavingTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const next = searchParams.get('next') || '/complete-profile?mode=signup&next=/'

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

        setMessage('Password saved. Continue to finish your account.')
        setError('')
        router.replace(next)
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : 'Could not save your password.')
        setMessage('')
      }
    })
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#2155ff_0%,#0f172a_58%,#020617_100%)] p-8 text-white shadow-[0_20px_70px_rgba(15,23,42,0.2)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Create Password</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl">Secure your new Nexzen account</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
            Your email is now verified. Set the password you will use for future Nexzen sign-ins.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Password Setup</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-slate-950">Choose your password</h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-700">
              Password
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
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
                  placeholder="Enter the password again"
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
              {isSaving ? 'Saving password...' : 'Continue'}
            </button>
          </form>

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
