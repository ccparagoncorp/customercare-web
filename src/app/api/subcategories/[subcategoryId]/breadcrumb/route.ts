import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subcategoryId: string }> }
) {
  const prisma = createPrismaClient()
  
  try {
    const { subcategoryId } = await params
    const subcategory = await prisma.subkategoriProduk.findUnique({
      where: {
        id: subcategoryId
      },
      select: {
        id: true,
        name: true
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
