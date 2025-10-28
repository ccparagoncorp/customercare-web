import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { brandName: string } }
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
            }
          }
        }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
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