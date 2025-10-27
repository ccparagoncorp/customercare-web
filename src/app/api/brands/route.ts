import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient()
  
  try {
    const brands = await prisma.brand.findMany({
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
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
