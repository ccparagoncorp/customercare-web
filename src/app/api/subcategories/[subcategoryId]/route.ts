import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { subcategoryId: string } }
) {
  const prisma = createPrismaClient()
  
  try {
    const subcategory = await prisma.subkategoriProduk.findUnique({
      where: {
        id: params.subcategoryId
      },
      include: {
        produks: {
          orderBy: {
            name: 'asc'
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
