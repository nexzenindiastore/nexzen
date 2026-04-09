import { handleAdminLogout } from './admin-logout-route'

export async function POST() {
  return handleAdminLogout()
}
