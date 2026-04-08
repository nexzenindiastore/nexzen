import { cookies } from 'next/headers'
import { deleteAdminSession, getAdminCookieName } from '@/lib/admin-auth'

export async function POST() {
  const cookieStore = await cookies()
  const session = cookieStore.get(getAdminCookieName())?.value

  await deleteAdminSession(session)
  cookieStore.delete(getAdminCookieName())

  return Response.json({ ok: true })
}
