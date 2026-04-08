'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm({ adminBasePath }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      })

      let result = {}

      try {
        const text = await response.text()
        result = text ? JSON.parse(text) : {}
      } catch {
        result = {}
      }

      if (!response.ok) {
        setError(result.error || 'Login failed. Please try again.')
        return
      }

      router.push(adminBasePath)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8">
      <label className="grid gap-2 text-sm text-slate-700">
        Username
        <input
          suppressHydrationWarning
          name="username"
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
          placeholder="admin"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-700">
        Password
        <input
          suppressHydrationWarning
          name="password"
          type="password"
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
          placeholder="Enter password"
        />
      </label>

      {error && (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        suppressHydrationWarning
        type="submit"
        disabled={isPending}
        className="interactive-button inline-flex w-fit items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
