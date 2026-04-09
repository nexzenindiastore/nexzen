export function getDisplayOrderId(order) {
  if (!order?.createdAt || !order?.id) {
    return 'NXZ-ORDER'
  }

  const date = new Date(order.createdAt)
  const datePart = [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('')
  const suffix = `${order.id}`.slice(-6).toUpperCase()

  return `NXZ-${datePart}-${suffix}`
}

export function isDeliveredOrder(order) {
  return Boolean(order?.deliveredAt) || `${order?.status || ''}`.toLowerCase() === 'delivered'
}

export function formatOrderDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
