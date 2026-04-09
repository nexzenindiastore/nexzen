import { handleCreateOrder, handleGetOrders } from './orders-route'

export async function GET(request) {
  return handleGetOrders(request)
}

export async function POST(request) {
  return handleCreateOrder(request)
}
