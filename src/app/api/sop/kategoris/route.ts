import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET() {
  const prisma = createPrismaClient()

  try {
    const kategoris = await prisma.kategoriSOP.findMany({
      include: {
        sops: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(kategoris)
  } catch (error) {
    console.error('Error fetching SOP categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SOP categories' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
