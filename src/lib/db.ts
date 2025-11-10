import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a new Prisma client instance for each request to avoid prepared statement conflicts
export const createPrismaClient = () => {
  // Use DIRECT_URL for Supabase to avoid prepared statement issues
  // Fallback to DATABASE_URL if DIRECT_URL is not available
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('Warning: DATABASE_URL or DIRECT_URL environment variable is not set')
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

// For development, use singleton pattern but recreate on each request
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
