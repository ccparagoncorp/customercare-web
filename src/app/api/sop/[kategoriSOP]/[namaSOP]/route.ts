import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kategoriSOP: string; namaSOP: string }> }
) {
  const prisma = createPrismaClient()

  try {
    const { kategoriSOP, namaSOP } = await params
    const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')
    const decodedNamaSOP = decodeURIComponent(namaSOP).replace(/-/g, ' ')

    // First find the category
    const kategori = await prisma.kategoriSOP.findFirst({
      where: {
        name: {
          equals: decodedKategoriSOP,
          mode: 'insensitive'
        }
      }
    })

    if (!kategori) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Then find the SOP within that category
    const sop = await prisma.sOP.findFirst({
      where: {
        name: {
          equals: decodedNamaSOP,
          mode: 'insensitive'
        },
        kategoriSOPId: kategori.id
      },
      include: {
        kategoriSOP: {
          select: {
            id: true,
            name: true
          }
        },
        jenisSOPs: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            detailSOPs: {
              orderBy: {
                createdAt: 'asc'
              }
            }
          }
        }
      }
    })

    if (!sop) {
      return NextResponse.json(
        { error: 'SOP not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sop)
  } catch (error) {
    console.error('Error fetching SOP:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SOP' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
