'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

const badgeTones = {
  amber: 'bg-amber-100 text-amber-900',
  emerald: 'bg-emerald-100 text-emerald-900',
  rose: 'bg-rose-100 text-rose-900',
  slate: 'bg-slate-200 text-slate-900',
  violet: 'bg-violet-100 text-violet-900',
  sky: 'bg-sky-100 text-sky-900',
  orange: 'bg-orange-100 text-orange-900',
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  function handleAdd() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div className={`${product.surface} relative overflow-hidden p-5 transition-colors duration-300`}>
          <div className={`relative h-44 overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${product.accent} p-5 text-white transition-transform duration-500 ease-out group-hover:scale-[1.02]`}>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeTones[product.badgeTone] || 'bg-white/90 text-slate-900'}`}>
                {product.badge}
              </span>
              {discount > 0 && (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                  Save {discount}%
                </span>
              )}
            </div>
            {product.imageUrl ? (
              <div className="absolute inset-x-3 bottom-3 top-11 rounded-[1.1rem] border border-white/15 bg-white/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <div className="relative h-full w-full overflow-hidden rounded-[0.9rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-2 drop-shadow-[0_18px_30px_rgba(15,23,42,0.28)]"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">{product.family}</p>
                <p className="mt-2 max-w-[14rem] font-heading text-2xl font-semibold leading-tight">{product.shortSpec}</p>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="min-h-[11.5rem] space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{product.categoryName || product.category.replace('-', ' ')}</p>
          <Link href={`/products/${product.slug || product.id}`} className="block">
            <h3 className="min-h-[3.75rem] font-heading text-xl font-semibold text-slate-950 transition group-hover:text-blue-700">
              {product.name}
            </h3>
          </Link>
          <p className="min-h-[4.75rem] text-sm leading-6 text-slate-600">{product.blurb}</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>{product.rating} rating</span>
          <span>{product.reviews} reviews</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="text-2xl font-semibold text-slate-950">Rs. {product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-sm text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</p>
            )}
          </div>
          <button
            suppressHydrationWarning
            type="button"
            disabled={!product.inStock}
            onClick={handleAdd}
            className={`interactive-button rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              !product.inStock
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-950 text-white hover:bg-blue-700 hover:shadow-[0_10px_24px_rgba(37,99,235,0.28)]'
            }`}
          >
            {!product.inStock ? 'Out of stock' : added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
