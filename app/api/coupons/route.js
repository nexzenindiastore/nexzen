import { handleCouponLookup } from './coupons-route'

export async function POST(request) {
  return handleCouponLookup(request)
}
