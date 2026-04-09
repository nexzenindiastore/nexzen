import crypto from 'node:crypto'
import { AuthProvider } from '@prisma/client'
import { getPrismaClient } from '@/lib/database/prisma'

function getSessionHashSecret() {
  return process.env.USER_AUTH_SECRET || process.env.ADMIN_AUTH_SECRET || 'nexzen-user-auth-secret'
}

export function hashUserSessionToken(token) {
  return crypto.createHash('sha256').update(`${token}:${getSessionHashSecret()}`).digest('hex')
}

export function normalizeAuthProvider(provider) {
  switch (`${provider || ''}`.toLowerCase()) {
    case 'github':
      return AuthProvider.GITHUB
    case 'google':
      return AuthProvider.GOOGLE
    case 'facebook':
      return AuthProvider.FACEBOOK
    case 'linkedin':
    case 'linkedin_oidc':
      return AuthProvider.LINKEDIN
    default:
      return AuthProvider.EMAIL
  }
}

function getDisplayName(user) {
  const metadata = user?.user_metadata || {}

  return (
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    (user?.email ? user.email.split('@')[0] : null)
  )
}

function getAvatarUrl(user) {
  const metadata = user?.user_metadata || {}
  return metadata.avatar_url || metadata.picture || null
}

export async function syncAuthenticatedUser({
  user,
  accessToken,
  provider,
  expiresAt,
}) {
  const prisma = getPrismaClient()
  const normalizedProvider = normalizeAuthProvider(provider || user?.app_metadata?.provider)
  const email = `${user?.email || ''}`.trim().toLowerCase()

  if (!user?.id || !email || !accessToken) {
    throw new Error('Missing required user auth data.')
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: user.id }, { email }],
    },
    select: {
      id: true,
    },
  })

  const appUser = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          authUserId: user.id,
          email,
          name: getDisplayName(user),
          avatarUrl: getAvatarUrl(user),
          preferredProvider: normalizedProvider,
          lastLoginAt: new Date(),
        },
      })
    : await prisma.user.create({
        data: {
          authUserId: user.id,
          email,
          name: getDisplayName(user),
          avatarUrl: getAvatarUrl(user),
          preferredProvider: normalizedProvider,
          lastLoginAt: new Date(),
        },
      })

  await prisma.userIdentity.upsert({
    where: {
      provider_providerUserId: {
        provider: normalizedProvider,
        providerUserId: user.id,
      },
    },
    update: {
      userId: appUser.id,
      email,
    },
    create: {
      userId: appUser.id,
      provider: normalizedProvider,
      providerUserId: user.id,
      email,
    },
  })

  await prisma.userSession.upsert({
    where: {
      sessionTokenHash: hashUserSessionToken(accessToken),
    },
    update: {
      userId: appUser.id,
      provider: normalizedProvider,
      expiresAt: expiresAt || null,
      lastSeenAt: new Date(),
    },
    create: {
      userId: appUser.id,
      provider: normalizedProvider,
      sessionTokenHash: hashUserSessionToken(accessToken),
      expiresAt: expiresAt || null,
      lastSeenAt: new Date(),
    },
  })

  return appUser
}

export async function deleteAuthenticatedUserSession(accessToken) {
  if (!accessToken) {
    return
  }

  const prisma = getPrismaClient()

  await prisma.userSession.deleteMany({
    where: {
      sessionTokenHash: hashUserSessionToken(accessToken),
    },
  })
}
