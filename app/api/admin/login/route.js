import { handleAdminLogin } from './admin-login-route'

export async function POST(request) {
  return handleAdminLogin(request)
}
