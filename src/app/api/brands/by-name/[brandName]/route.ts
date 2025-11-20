import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Cache brand by name for 5 minutes
const getCachedBrand = unstable_cache(
  async (decodedBrandName: string) => {
    const prisma = createPrismaClient()
    try {
      const brand = await prisma.brand.findFirst({
        where: {
          name: {
            equals: decodedBrandName,
            mode: 'insensitive'
          }
        },
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
        }
      })

      // Fetch products directly from brand (brandId is set, categoryId and subkategoriProdukId are null)
      const whereClause = {
        brandId: brand?.id,
        categoryId: null,
        subkategoriProdukId: null
      } as Record<string, unknown>
      
      const allBrandProducts = brand ? await prisma.produk.findMany({
        where: whereClause as Parameters<typeof prisma.produk.findMany>[0] extends { where?: infer W } ? W : never,
        orderBy: { name: 'asc' },
        include: {
          detailProduks: true
        }
      }) : []
      
      await prisma.$disconnect()
      
      if (!brand) {
        return null
      }

      // Add direct products to brand object
      return {
        ...brand,
        produks: allBrandProducts
      }
    } catch (error) {
      await prisma.$disconnect().catch(() => {})
      throw error
    }
  },
  ['brand-by-name'],
  {
    revalidate: 300, // 5 minutes
    tags: ['brands']
  }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string }> }
) {
  try {
    const { brandName } = await params
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    
    const brandWithProducts = await getCachedBrand(decodedBrandName)

    if (!brandWithProducts) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(brandWithProducts)
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
      console.warn('Database connectivity issue, returning 503:', errorMessage)
      return NextResponse.json(
        { error: 'Database connection unavailable' },
        { status: 503 }
      )
    }

    console.error('Error fetching brand by name:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}