import { handleUserLogout } from './user-logout-route'

export async function POST(request) {
  return handleUserLogout(request)
}
