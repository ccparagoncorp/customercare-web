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
    // Note: Using brand relation to filter, then filter in application to ensure categoryId and subkategoriProdukId are null
    // This is needed because Prisma client may not recognize brandId, categoryId, subkategoriProdukId fields yet
    const allBrandProducts = brand ? await prisma.produk.findMany({
      where: {
        brand: {
          id: brand.id
        }
      },
      orderBy: { name: 'asc' },
      include: {
        detailProduks: true
      }
    }) : []
    
    // Filter products where categoryId and subkategoriProdukId are null (direct products from brand)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directProductsQuery = allBrandProducts.filter((product: any) => 
      !product.categoryId && !product.subkategoriProdukId
    )

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
    console.error('Error fetching brand by name:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}