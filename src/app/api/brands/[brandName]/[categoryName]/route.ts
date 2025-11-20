import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Cache category by brand and category name for 5 minutes
const getCachedCategory = unstable_cache(
  async (decodedBrandName: string, decodedCategoryName: string) => {
    const prisma = createPrismaClient()
    try {
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

      await prisma.$disconnect()
      return category
    } catch (error) {
      await prisma.$disconnect().catch(() => {})
      throw error
    }
  },
  ['category-by-brand-name'],
  {
    revalidate: 300, // 5 minutes
    tags: ['categories']
  }
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string; categoryName: string }> }
) {
  try {
    const { brandName, categoryName } = await params
    
    // Decode the names
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')

    const category = await getCachedCategory(decodedBrandName, decodedCategoryName)

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
  }
}
