'use client'

import { useState } from 'react'

export default function DecoyLoginForm({ title, description }) {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('Unable to verify credentials. Please contact your system administrator.')
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Restricted Access</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8">
          <label className="grid gap-2 text-sm text-slate-700">
            Username
            <input
              name="username"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Enter username"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input
              name="password"
              type="password"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500"
              placeholder="Enter password"
            />
          </label>
          {message && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {message}
            </p>
          )}
          <button
            type="submit"
            className="interactive-button inline-flex w-fit items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  )
}
