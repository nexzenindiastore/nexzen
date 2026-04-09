'use client'

import { useState } from 'react'
import { useCart } from '@/providers/CartProvider'

export default function ProductActions({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <button
        suppressHydrationWarning
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className={`interactive-button inline-flex justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
          !product.inStock
            ? 'cursor-not-allowed bg-slate-100 text-slate-400'
            : added
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-950 text-white hover:bg-blue-700 hover:shadow-[0_16px_36px_rgba(37,99,235,0.24)]'
        }`}
      >
        {!product.inStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
      </button>
    </div>
  )
}
