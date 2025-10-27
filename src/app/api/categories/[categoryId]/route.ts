import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  const prisma = createPrismaClient()
  
  try {
    const category = await prisma.kategoriProduk.findUnique({
      where: {
        id: params.categoryId
      },
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
