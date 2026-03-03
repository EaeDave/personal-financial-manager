import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { AuthResponse, LoginDTO, RegisterDTO } from './types'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const COOKIE_NAME = 'auth_token'
const TOKEN_EXPIRY = '7d'

function createToken(user: { id: string; email: string }): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  })
}

function setAuthCookie(token: string) {
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export const registerFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as RegisterDTO

  // Validate required fields
  if (
    !payload.firstName ||
    !payload.lastName ||
    !payload.email ||
    !payload.phone ||
    !payload.birthDate ||
    !payload.password
  ) {
    return { success: false, error: 'missing_fields' } as AuthResponse
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  })

  if (existingUser) {
    return { success: false, error: 'email_already_exists' } as AuthResponse
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.toLowerCase().trim(),
      phone: payload.phone.replace(/\D/g, ''), // store only digits
      birthDate: new Date(payload.birthDate),
      password: hashedPassword,
    },
  })

  // Create JWT and set cookie
  const token = createToken(user)
  setAuthCookie(token)

  return {
    success: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate.toISOString(),
    },
  } as AuthResponse
})

export const loginFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const payload = data as LoginDTO

  if (!payload.email || !payload.password) {
    return { success: false, error: 'missing_fields' } as AuthResponse
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  })

  if (!user) {
    return { success: false, error: 'invalid_credentials' } as AuthResponse
  }

  // Compare password
  const isValid = await bcrypt.compare(payload.password, user.password)

  if (!isValid) {
    return { success: false, error: 'invalid_credentials' } as AuthResponse
  }

  // Create JWT and set cookie
  const token = createToken(user)
  setAuthCookie(token)

  return {
    success: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate.toISOString(),
    },
  } as AuthResponse
})

export const logoutFn = createServerFn({ method: 'POST' }).handler(() => {
  deleteCookie(COOKIE_NAME)
  return { success: true }
})

export const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const token = getCookie(COOKIE_NAME)

  if (!token) {
    return { success: false, user: undefined } as AuthResponse
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        birthDate: true,
      },
    })

    if (!user) {
      deleteCookie(COOKIE_NAME)
      return { success: false, user: undefined } as AuthResponse
    }

    return {
      success: true,
      user: {
        ...user,
        birthDate: user.birthDate.toISOString(),
      },
    } as AuthResponse
  } catch {
    deleteCookie(COOKIE_NAME)
    return { success: false, user: undefined } as AuthResponse
  }
})
