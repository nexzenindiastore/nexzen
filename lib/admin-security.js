const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5

const globalState = globalThis

if (!globalState.__nexzenAdminSecurity) {
  globalState.__nexzenAdminSecurity = {
    attempts: new Map(),
    failures: new Map(),
  }
}

const store = globalState.__nexzenAdminSecurity

function now() {
  return Date.now()
}

function cleanup(map, windowMs) {
  const cutoff = now() - windowMs

  for (const [key, values] of map.entries()) {
    const filtered = values.filter((value) => value > cutoff)

    if (filtered.length === 0) {
      map.delete(key)
    } else {
      map.set(key, filtered)
    }
  }
}

export function getClientIpFromHeaders(headersLike) {
  const forwardedFor = headersLike.get('x-forwarded-for')
  const realIp = headersLike.get('x-real-ip')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  if (realIp) {
    return realIp.trim()
  }

  return ''
}

export function isIpAllowed(ip, allowedIps) {
  if (!allowedIps || allowedIps.length === 0) {
    return true
  }

  if (!ip) {
    return false
  }

  return allowedIps.includes(ip)
}

export function getLoginRateLimitState() {
  return {
    allowed: true,
    remaining: MAX_LOGIN_ATTEMPTS,
    retryAfterMs: 0,
  }
}

export function recordLoginAttempt() {}

export function recordFailedLogin(key) {
  cleanup(store.failures, RATE_WINDOW_MS)
  const timestamps = store.failures.get(key) || []
  timestamps.push(now())
  store.failures.set(key, timestamps)

  return Math.min(5000, timestamps.length * 1000)
}

export function clearFailedLogins(key) {
  store.failures.delete(key)
}

export async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
