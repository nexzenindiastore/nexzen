import Link from 'next/link'
import { formatOrderDate, getDisplayOrderId, isDeliveredOrder } from '@/lib/commerce/orders'

function EmptyOrders({ mode }) {
  const isActive = mode === 'active'

  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
      <h2 className="font-heading text-2xl font-semibold text-slate-950">
        {isActive ? 'No active orders right now' : 'No delivered items yet'}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {isActive
          ? 'Once an order is placed and still in progress, it will appear here with delivery and support details.'
          : 'Delivered items will move here automatically after the order status becomes delivered.'}
      </p>
      <Link
        href="/products"
        className="interactive-button mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 hover:shadow-[0_16px_36px_rgba(37,99,235,0.24)]"
      >
        Continue shopping
      </Link>
    </div>
  )
}

export default function OrdersPanel({
  eyebrow,
  title,
  subtitle,
  orders = [],
  ordersLoading,
  ordersError,
  mode = 'active',
}) {
  const filteredOrders = orders.filter((order) =>
    mode === 'delivered' ? isDeliveredOrder(order) : !isDeliveredOrder(order)
  )

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)] sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-blue-700">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{subtitle}</p>
      </div>

      {ordersLoading ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-700">Loading</p>
          <h3 className="mt-3 font-heading text-2xl font-semibold text-slate-950">Fetching your saved orders...</h3>
        </div>
      ) : ordersError ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
          <p className="text-sm uppercase tracking-[0.24em] text-rose-600">Orders</p>
          <h3 className="mt-3 font-heading text-2xl font-semibold text-rose-950">Could not load this order view</h3>
          <p className="mt-3 text-sm leading-7">{ordersError}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyOrders mode={mode} />
      ) : (
        filteredOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_16px_48px_rgba(15,23,42,0.05)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order ID</p>
                <h3 className="mt-2 font-heading text-3xl font-semibold text-slate-950">
                  {order.displayId || getDisplayOrderId(order)}
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {order.status || (mode === 'delivered' ? 'delivered' : 'processing')}
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    {mode === 'delivered' ? 'Completed' : 'In progress'}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Placed on</p>
                  <p className="mt-2 text-sm font-medium text-slate-950">{formatOrderDate(order.createdAt)}</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total</p>
                  <p className="mt-2 text-sm font-medium text-slate-950">
                    Rs. {Number(order.total || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                {mode === 'delivered' ? (
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Delivered</p>
                    <p className="mt-2 text-sm font-medium text-emerald-950">
                      {formatOrderDate(order.deliveredAt || order.createdAt)}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tracking</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">{order.trackingNumber || 'Pending assignment'}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Courier</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">{order.courierName || 'To be updated'}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Support ticket</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">{order.supportTicketId || 'Generated after dispatch'}</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Estimated delivery</p>
                      <p className="mt-2 text-sm font-medium text-slate-950">
                        {order.estimatedDelivery ? formatOrderDate(order.estimatedDelivery) : 'Awaiting courier update'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {mode !== 'delivered' && order.lastTrackingUpdate && (
              <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-700">Latest update</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{order.lastTrackingUpdate}</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Items</p>
              <div className="mt-4 grid gap-4">
                {(order.items || []).map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.product?.slug || item.product?.id || ''}`}
                    className="interactive-button flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 px-5 py-4 transition hover:border-blue-200 hover:bg-blue-50/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{item.product?.name || 'Product removed'}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Quantity: {item.quantity} • Rs. {Number(item.price || 0).toLocaleString('en-IN')} each
                      </p>
                    </div>
                    <span className="text-sm font-medium text-blue-700">Open product -&gt;</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
