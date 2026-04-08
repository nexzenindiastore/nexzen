import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#3b82f6,#22d3ee)] font-semibold text-slate-950">
              NZ
            </div>
            <div>
              <p className="font-heading text-2xl font-semibold text-white">Nexzen</p>
              <p className="text-sm text-slate-400">Modern electronics commerce</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Nexzen is a sleek electronics storefront concept inspired by established hardware marketplaces and rebuilt with a more premium, modern browsing experience.
          </p>
        </div>

        <div>
          <p className="font-heading text-lg font-semibold text-white">Shop</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/products" className="transition hover:text-white">All products</Link>
            <Link href="/products?category=development-boards" className="transition hover:text-white">Development boards</Link>
            <Link href="/products?category=sensors-modules" className="transition hover:text-white">Sensors and modules</Link>
            <Link href="/products?category=stem-kits" className="transition hover:text-white">Maker kits</Link>
          </div>
        </div>

        <div>
          <p className="font-heading text-lg font-semibold text-white">Why it works</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <p>Cleaner category mapping</p>
            <p>Higher contrast calls to action</p>
            <p>Responsive product-first layouts</p>
            <p>Ready for catalog expansion</p>
          </div>
        </div>

        <div>
          <p className="font-heading text-lg font-semibold text-white">Contact</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <p>support@nexzen.store</p>
            <p>+91 98765 43210</p>
            <p>Mon to Sat, 10:00 to 18:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        Copyright 2026 Nexzen. Designed as a modern electronics storefront concept.
      </div>
    </footer>
  )
}
