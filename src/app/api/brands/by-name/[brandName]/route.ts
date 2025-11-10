import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string }> }
) {
  const prisma = createPrismaClient() 

  try {
    const { brandName } = await params
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    
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
    // Note: Using type assertion because Prisma client may not recognize brandId, categoryId, subkategoriProdukId fields yet
    // These fields exist in the schema but Prisma client needs to be regenerated
    const whereClause = {
      brandId: brand?.id,
      categoryId: null,
      subkategoriProdukId: null
    } as Record<string, unknown>
    
    const allBrandProducts = brand ? await prisma.produk.findMany({
      // Type assertion needed because Prisma client may not recognize these fields yet
      where: whereClause as Parameters<typeof prisma.produk.findMany>[0] extends { where?: infer W } ? W : never,
      orderBy: { name: 'asc' },
      include: {
        detailProduks: true
      }
    }) : []
    
    // Use the filtered products directly
    const directProductsQuery = allBrandProducts

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Add direct products to brand object
    const brandWithProducts = {
      ...brand,
      produks: directProductsQuery
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
  } finally {
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      // Ignore disconnect errors
      console.warn('Error disconnecting Prisma client:', disconnectError)
    }
  }
}