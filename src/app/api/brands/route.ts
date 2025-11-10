import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET() {
  const prisma = createPrismaClient()
  
  try {
    const brands = await prisma.brand.findMany({
      include: {
        kategoriProduks: {
          include: {
            subkategoriProduks: {
              include: {
                produks: {
                  select: {
                    id: true,
                    name: true,
                    status: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(brands)
  } catch (error) {
    // Check if it's a database connectivity issue
    const errorObj = error as { message?: string; name?: string }
    const errorMessage = errorObj?.message || ''
    const isDbConnectivityIssue = 
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes('Invalid `prisma') ||
      errorMessage.includes('does not exist') ||
      errorMessage.includes('column') ||
      errorObj?.name?.includes('Prisma') ||
      errorObj?.name === 'PrismaClientInitializationError'

    if (isDbConnectivityIssue || !process.env.DATABASE_URL) {
      console.warn('Database connectivity issue, returning empty array:', errorMessage)
      return NextResponse.json([], { status: 503 })
    }

    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      // Ignore disconnect errors
      console.warn('Error disconnecting Prisma client:', disconnectError)
    }
  }
}
