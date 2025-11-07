import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string; categoryName: string; subcategoryName: string }> }
) {
  const prisma = createPrismaClient()

  try {
    const { brandName, categoryName, subcategoryName } = await params
    
    // Decode the names
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
    const decodedSubcategoryName = decodeURIComponent(subcategoryName).replace(/-/g, ' ')

    const subcategory = await prisma.subkategoriProduk.findFirst({
      where: {
        name: {
          equals: decodedSubcategoryName,
          mode: 'insensitive'
        },
        kategoriProduk: {
          name: {
            equals: decodedCategoryName,
            mode: 'insensitive'
          },
          brand: {
            name: {
              equals: decodedBrandName,
              mode: 'insensitive'
            }
          }
        }
      },
      include: {
        kategoriProduk: {
          include: {
            brand: true
          }
        },
        produks: {
          orderBy: { name: 'asc' },
          include: {
            detailProduks: true
          }
        }
      }
    })

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error('Error fetching subcategory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subcategory' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
