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
    interface ProductWithDetails {
      id: string
      name: string
      description: string | null
      status: string
      images: string[]
      detailProduks: Array<{
        id: string
        name: string
        detail: string
        images: string[]
      }>
    }
    
    let directProducts: ProductWithDetails[] = []
    if (brand) {
      directProducts = await prisma.produk.findMany({
        where: {
          brandId: brand.id,
          categoryId: null,
          subkategoriProdukId: null
        },
        orderBy: { name: 'asc' },
        include: {
          detailProduks: true
        }
      }) as ProductWithDetails[]
    }

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Add direct products to brand object
    const brandWithProducts = {
      ...brand,
      produks: directProducts
    }

    return NextResponse.json(brandWithProducts)
  } catch (error) {
    console.error('Error fetching brand by name:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}