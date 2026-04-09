import { deleteAuthenticatedUserSession } from '@/lib/auth/user-auth'

function getBearerToken(request) {
  const authorization = request.headers.get('authorization') || ''

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return null
  }

  return authorization.slice(7).trim()
}

export async function handleUserLogout(request) {
  try {
    const accessToken = getBearerToken(request)
    await deleteAuthenticatedUserSession(accessToken)

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Could not end the user session.',
      },
      { status: 500 }
    )
  }
}
