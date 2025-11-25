import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaClient = prisma as any

  try {
    // Check if announcement model exists - Prisma uses plural form from @@map
    const announcementModel = prismaClient.announcements
    
    if (!announcementModel) {
      console.error('Announcements model not found. Available models:', Object.keys(prismaClient).filter(key => !key.startsWith('_')))
      await prisma.$disconnect()
      return NextResponse.json(
        { 
          error: 'Announcements model not found in Prisma Client. Please stop dev server, run "npx prisma generate", then restart dev server.',
          details: 'Model announcements is missing from Prisma Client',
          announcements: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
        },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Optional pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Fetch announcements ordered by newest first
    const announcements = await announcementModel.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        link: true,
        image: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Get total count for pagination
    const total = await announcementModel.count()

    await prisma.$disconnect()

    return NextResponse.json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    
    // Check if it's a database connectivity or schema issue
    const errorObj = error as { message?: string; name?: string; code?: string }
    const errorMessage = errorObj?.message || ''
    const errorCode = errorObj?.code || ''
    
    const isDbConnectivityIssue = 
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes('Invalid `prisma') ||
      errorMessage.includes('does not exist') ||
      errorMessage.includes('Unknown model') ||
      errorMessage.includes('Unknown table') ||
      errorCode === 'P2001' || // Table does not exist
      errorCode === 'P2021' || // Table does not exist
      errorCode === 'P2025' || // Record not found (though this shouldn't apply here)
      errorObj?.name?.includes('Prisma')

    if (isDbConnectivityIssue || !process.env.DATABASE_URL) {
      console.warn('Database connectivity issue or table does not exist:', errorMessage)
      return NextResponse.json(
        { 
          error: 'Database table not found. Please run: npx prisma db push',
          details: errorMessage,
          announcements: [],
          pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch announcements',
        details: errorMessage,
        announcements: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
      },
      { status: 500 }
    )
  }
}

