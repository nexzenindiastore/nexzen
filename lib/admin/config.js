function normalizeBasePath(value) {
  const trimmed = `${value || ''}`.trim()

  if (!trimmed) {
    return '/nexzen-control-room'
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function getAdminBasePath() {
  return normalizeBasePath(process.env.ADMIN_BASE_PATH || '/nexzen-control-room')
}

export function getAllowedAdminIps() {
  return `${process.env.ADMIN_ALLOWED_IPS || ''}`
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}
