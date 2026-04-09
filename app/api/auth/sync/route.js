import { handleUserSessionSync } from './user-session-sync-route'

export async function POST(request) {
  return handleUserSessionSync(request)
}
