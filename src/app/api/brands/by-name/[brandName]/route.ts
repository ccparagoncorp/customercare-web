import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string }> }
) {
  const prisma = createPrismaClient()
  
  try {
    // Await params and decode the brand name from URL
    const { brandName } = await params
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    
    // Use simple Prisma query without complex includes to avoid prepared statement issues
    const brands = await prisma.brand.findMany({
      where: {
        name: {
          equals: decodedBrandName,
          mode: 'insensitive'
        }
      }
    })

    if (!brands || brands.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    const brand = brands[0]
    
    // Fetch related data in separate queries to avoid complex prepared statements
    const kategoriProduks = await prisma.kategoriProduk.findMany({
      where: { brandId: brand.id },
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
    })

    return NextResponse.json({
      ...brand,
      kategoriProduks
    })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
