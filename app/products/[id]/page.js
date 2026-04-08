import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getProductById, getProductsByCategory } from '@/data/products'

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    return {
      title: 'Product not found | Nexzen',
    }
  }

  return {
    title: `${product.name} | Nexzen`,
    description: product.blurb,
  }
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    return (
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
          <h1 className="font-heading text-3xl font-semibold text-slate-950">Product not found</h1>
          <p className="mt-3 text-slate-600">This item is not in the demo catalog yet.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            Back to products
          </Link>
        </div>
      </section>
    )
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter((item) => item.id !== product.id)
    .slice(0, 3)

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className={`${product.surface} rounded-[2rem] border border-slate-200 p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8`}>
            <div className={`min-h-[28rem] rounded-[1.75rem] bg-gradient-to-br ${product.accent} p-8 text-white`}>
              <p className="text-sm uppercase tracking-[0.22em] text-white/70">{product.family}</p>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl">{product.name}</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/80">{product.blurb}</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Primary spec</p>
                  <p className="mt-2 text-lg font-semibold">{product.shortSpec}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Availability</p>
                  <p className="mt-2 text-lg font-semibold">{product.inStock ? 'In stock' : 'Restocking soon'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Product details</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-950">
              Rs. {product.price.toLocaleString()}
            </h2>
            {product.originalPrice && (
              <p className="mt-2 text-sm text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</p>
            )}
            <p className="mt-6 text-base leading-7 text-slate-600">{product.blurb}</p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rating</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{product.rating} from {product.reviews} reviews</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Category</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{product.category}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/cart" className="inline-flex justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                Open cart
              </Link>
              <Link href="/products" className="inline-flex justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                Continue browsing
              </Link>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-heading text-3xl font-semibold text-slate-950">Related products</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
