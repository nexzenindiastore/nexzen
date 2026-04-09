import { handleHealthCheck } from './health-route'

export async function GET() {
  return handleHealthCheck()
}
