import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string; categoryName: string }> }
) {
  const prisma = createPrismaClient()

  try {
    const { brandName, categoryName } = await params
    
    // Decode the names
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')

    const category = await prisma.kategoriProduk.findFirst({
      where: {
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
      },
      include: {
        brand: true,
        // Include subcategories with their products
        subkategoriProduks: {
          include: {
            produks: {
              orderBy: { name: 'asc' },
              include: {
                detailProduks: true
              }
            }
          }
        },
        // Also include top-level products that belong directly to the category
        // (categoryId is set, subkategoriProdukId is null)
        produks: {
          where: {
            subkategoriProdukId: null
          },
          orderBy: { name: 'asc' },
          include: {
            detailProduks: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
