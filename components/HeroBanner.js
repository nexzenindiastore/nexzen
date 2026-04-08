'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { heroSlides } from '@/data/products'

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[current]

  return (
    <section className="relative overflow-hidden px-4 pt-6 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br ${slide.accent} p-8 text-white shadow-[0_40px_120px_rgba(2,6,23,0.45)] transition-[background] duration-700 ease-out sm:p-12`}>
        <div className="absolute inset-0 opacity-30">
          <div className="animate-float absolute left-[-4rem] top-[-6rem] h-48 w-48 rounded-full bg-cyan-300 blur-3xl" />
          <div className="animate-float absolute bottom-[-5rem] right-[-2rem] h-56 w-56 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div key={slide.id} className="animate-fade-up relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-cyan-100">
              {slide.eyebrow}
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={slide.primaryHref}
                className="interactive-button inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/15 hover:shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
                style={{ color: '#ffffff', textShadow: '0 1px 1px rgba(0,0,0,0.18)' }}
              >
                {slide.cta}
              </Link>
              <Link
                href={slide.secondaryHref}
                className="interactive-button inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 hover:shadow-[0_16px_40px_rgba(15,23,42,0.18)]"
              >
                {slide.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="animate-soft-pop rounded-[2rem] border border-white/15 bg-slate-950/25 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Build velocity</p>
              <p className="mt-4 font-heading text-4xl font-semibold">{slide.metric}</p>
              <div className="mt-6 grid gap-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10">Curated navigation for boards, sensing, motion, and kits.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10">Clean product cards and high-contrast CTAs for faster browsing.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:bg-white/10">A more premium storefront feel than a typical parts catalog clone.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex gap-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(index)}
              className={`interactive-button h-2.5 rounded-full transition-all ${index === current ? 'w-10 bg-white' : 'w-2.5 bg-white/40'}`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
