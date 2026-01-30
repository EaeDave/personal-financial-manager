import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load .env file manually if DATABASE_URL is not set
// This ensures compatibility with Bun, Vite, and Nitro
function loadEnvFile() {
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    return
  }

  if (process.env.DATABASE_URL) {
    return // Already loaded
  }

  try {
    const envPath = resolve(process.cwd(), '.env')
    const envFile = readFileSync(envPath, 'utf-8')
    const envLines = envFile.split('\n')

    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value
          }
        }
      }
    }
  } catch (error) {
    // .env file may not exist or be readable
    // This is okay - Bun may have already loaded it or it may be set via environment
  }
}

// Load environment variables on module load (server side only)
loadEnvFile()

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  if (typeof window !== 'undefined') {
    throw new Error('Prisma Client can only be used on the server side')
  }

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'Please ensure your .env file contains DATABASE_URL or set it as an environment variable. ' +
        `Current NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`
    )
  }

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Only create client on server side
let prismaInstance: PrismaClient | null = null

if (typeof window === 'undefined') {
  prismaInstance = globalForPrisma.prisma || createPrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
}

export const prisma = prismaInstance as PrismaClient

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
