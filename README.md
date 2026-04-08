# Nexzen — Electronics Ecommerce Store
### Built with Next.js + Tailwind CSS

---

## What's in Phase 2

| File | What it does |
|---|---|
| `app/layout.js` | Wraps entire site with Navbar + Footer |
| `app/globals.css` | Global styles + Tailwind setup |
| `app/page.js` | 🏠 The Homepage |
| `context/CartContext.js` | Global cart state (add/remove items) |
| `data/products.js` | Sample product + category data |
| `components/Navbar.js` | Top nav with search, login, cart |
| `components/HeroBanner.js` | Auto-rotating hero slider |
| `components/ProductCard.js` | Product tile with Add to Cart |
| `components/CategoryGrid.js` | Category cards grid |
| `components/Footer.js` | Site footer with links |

---

## Setup Instructions (Step by Step)

### Step 1 — Create the project
```bash
npx create-next-app@latest nexzen
cd nexzen
```
When prompted:
- TypeScript → No
- ESLint → Yes
- Tailwind CSS → Yes
- App Router → Yes
- Import alias (@/*) → Yes

### Step 2 — Copy the files
Copy all the files from this folder into your project,
matching the folder structure exactly.

### Step 3 — Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

You should now see the full Nexzen homepage! 🎉

---

## File Structure
```
nexzen/
├── app/
│   ├── layout.js       ← Root layout
│   ├── page.js         ← Homepage
│   └── globals.css     ← Global CSS
├── components/
│   ├── Navbar.js
│   ├── HeroBanner.js
│   ├── ProductCard.js
│   ├── CategoryGrid.js
│   └── Footer.js
├── context/
│   └── CartContext.js  ← Global cart state
└── data/
    └── products.js     ← Sample product data
```

---

## Coming in Phase 3 — Products Page
- Full products listing with filters
- Search by name
- Filter by category and price

## Coming in Phase 4 — Shopping Cart Page
- Cart sidebar / full cart page
- Quantity controls
- Remove items

## Coming in Phase 5 — Stripe Payments
- Checkout form
- Stripe payment integration

## Coming in Phase 6 — User Auth
- Login / Register pages
- User account dashboard