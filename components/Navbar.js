'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { categories } from '@/data/products'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const router = useRouter()
  const { cartCount } = useCart()
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  function submitSearch(event) {
    event.preventDefault()
    const value = query.trim()
    router.push(value ? `/products?query=${encodeURIComponent(value)}` : '/products')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,10,20,0.78)] backdrop-blur-xl">
      <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(38,92,255,0.2),rgba(17,24,39,0))]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs text-slate-200 sm:px-6">
          <p>Launch offer: 5% off on your first build with code `NEXZEN5`.</p>
          <p className="hidden md:block">Trusted by student teams, labs, and hardware makers across India.</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6,#22d3ee)] font-semibold text-slate-950">
              NZ
            </div>
            <div>
              <p className="font-heading text-xl font-semibold tracking-tight text-white">Nexzen</p>
              <p className="text-xs text-slate-400">Electronics for modern builders</p>
            </div>
          </div>
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden flex-1 items-center rounded-full border border-white/10 bg-white/5 px-2 md:flex"
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search boards, kits, sensors, or power modules"
            className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="interactive-button rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200 hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
          >
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-5 text-sm text-slate-300 lg:flex">
          <Link href="/products" className="transition hover:text-white">
            Catalog
          </Link>
          <Link href="/products?category=stem-kits" className="transition hover:text-white">
            Kits
          </Link>
          <Link href="/products?sort=newest" className="transition hover:text-white">
            New arrivals
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/cart"
            className="interactive-button relative rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 hover:shadow-[0_12px_30px_rgba(15,23,42,0.22)]"
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-cyan-300 px-2 py-0.5 text-xs font-semibold text-slate-950">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="interactive-button rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white md:hidden hover:bg-white/10"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="hidden border-t border-white/10 lg:block">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm text-slate-300 sm:px-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="interactive-button rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-white hover:shadow-[0_14px_32px_rgba(34,211,238,0.14)]"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex items-center rounded-2xl border border-white/10 bg-white/5 px-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search catalog"
              className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="interactive-button rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
              Go
            </button>
          </form>
          <div className="flex flex-col gap-2">
            <Link href="/products" onClick={() => setMobileOpen(false)} className="interactive-button rounded-2xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/10">
              Full catalog
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                onClick={() => setMobileOpen(false)}
                className="interactive-button rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
