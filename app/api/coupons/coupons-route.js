import { getPrismaClient } from '@/lib/database/prisma'

export async function handleCouponLookup(request) {
  try {
    const prisma = getPrismaClient()
    const body = await request.json()
    const code = `${body?.code || ''}`.trim()

    if (!code) {
      return Response.json({ error: 'Coupon code is required.' }, { status: 400 })
    }

    const rows = await prisma.$queryRaw`
      SELECT "id", "name", "discountPercent"
      FROM "coupons"
      WHERE LOWER("name") = LOWER(${code})
        AND "isActive" = true
      LIMIT 1
    `
    const coupon = Array.isArray(rows) ? rows[0] : null

    if (!coupon) {
      return Response.json({ error: 'Invalid coupon code.' }, { status: 404 })
    }

    return Response.json({
      ok: true,
      coupon,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong while checking the coupon.'

    return Response.json({ error: message }, { status: 500 })
  }
}
