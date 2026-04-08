'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Cart</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-slate-950">Your selected build items</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            This is a client-side demo cart for the storefront. You can adjust quantities and use it as the base for a future checkout flow.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="font-heading text-2xl font-semibold text-slate-950">Your cart is empty</h2>
            <p className="mt-3 text-slate-600">Add a few products from the catalog to see the cart in action.</p>
            <Link href="/products" className="interactive-button mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 hover:shadow-[0_16px_36px_rgba(37,99,235,0.24)]">
              Explore products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.family}</p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-950">{item.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">Rs. {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="interactive-button h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold text-slate-950">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="interactive-button h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="interactive-button rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Summary</p>
              <div className="mt-6 flex items-end justify-between">
                <span className="text-slate-300">Subtotal</span>
                <span className="font-heading text-3xl font-semibold">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Checkout is not wired yet, but this layout is ready for payment, address, and shipping integration later.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button type="button" className="interactive-button rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200 hover:shadow-[0_16px_36px_rgba(255,255,255,0.16)]">
                  Proceed to checkout
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="interactive-button rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
