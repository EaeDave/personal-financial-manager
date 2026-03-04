import { getCookie } from '@tanstack/react-start/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const COOKIE_NAME = 'auth_token'

/**
 * Server-side helper: reads the JWT cookie and returns the userId.
 * Throws a 401 error if the user is not authenticated.
 */
export function requireAuth(): string {
  const token = getCookie(COOKIE_NAME)

  if (!token) {
    throw new Error('UNAUTHORIZED')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded.userId
  } catch {
    throw new Error('UNAUTHORIZED')
  }
}
