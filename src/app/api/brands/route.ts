import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Cache brands for 5 minutes (300 seconds) - data rarely changes
const getCachedBrands = unstable_cache(
  async () => {
    const prisma = createPrismaClient()
    try {
      // Optimized: select only needed fields
      const brands = await prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          link_sampul: true,
          colorbase: true,
          kategoriProduks: {
            select: {
              id: true,
              name: true,
              description: true,
              images: true,
              subkategoriProduks: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  images: true,
                  produks: {
                    select: {
                      id: true,
                      name: true,
                      status: true
                    }
                  }
                }
              },
              produks: {
                select: {
                  id: true,
                  name: true,
                  status: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
      
      await prisma.$disconnect()
      return brands
    } catch (error) {
      await prisma.$disconnect().catch(() => {})
      throw error
    }
  },
  ['brands-list'],
  {
    revalidate: 300, // 5 minutes
    tags: ['brands']
  }
)

export async function GET() {
  try {
    const brands = await getCachedBrands()
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
  }
}
