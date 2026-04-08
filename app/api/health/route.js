import { prisma } from '@/lib/prisma'

export async function GET() {
  const productCount = await prisma.product.count()

  return Response.json({
    ok: true,
    productCount,
  })
}
