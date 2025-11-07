import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kategoriSOP: string }> }
) {
  const prisma = createPrismaClient()

  try {
    const { kategoriSOP } = await params
    const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')

    const kategori = await prisma.kategoriSOP.findFirst({
      where: {
        name: {
          equals: decodedKategoriSOP,
          mode: 'insensitive'
        }
      },
      include: {
        sops: {
          orderBy: {
            name: 'asc'
          },
          include: {
            jenisSOPs: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!kategori) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(kategori)
  } catch (error) {
    console.error('Error fetching SOP category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SOP category' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
