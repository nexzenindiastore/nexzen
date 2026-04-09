'use client'

// =============================================
// CartContext.js
// This file creates a "global storage" for the cart.
// Any component in the app can read/update the cart
// without passing data through every parent component.
// =============================================

import { createContext, useContext, useState } from 'react'

// Step 1: Create the context (like an empty box)
const CartContext = createContext()

// Step 2: Create the Provider — wraps the whole app and
// shares cart data with every child component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  // Add item to cart (or increase quantity if already exists)
  function addToCart(product) {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        // Item already in cart — just increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // New item — add with quantity 1
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove item completely from cart
  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  // Update quantity of a specific item
  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // Clear entire cart
  function clearCart() {
    setCartItems([])
    setAppliedCoupon(null)
  }

  function applyCoupon(coupon) {
    setAppliedCoupon(coupon)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
  }

  // Total number of items in cart (sum of all quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Total price of all items
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discountAmount = appliedCoupon
    ? Math.round(cartTotal * (appliedCoupon.discountPercent / 100))
    : 0
  const finalTotal = Math.max(0, cartTotal - discountAmount)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        cartCount,
        cartTotal,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Step 3: Custom hook — makes it easy to use cart in any component
// Instead of writing: const { cartItems } = useContext(CartContext)
// You write: const { cartItems } = useCart()
export function useCart() {
  return useContext(CartContext)
}
