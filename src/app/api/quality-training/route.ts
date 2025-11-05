import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export async function GET() {
  const prisma = createPrismaClient()
  
  try {
    const qualityTrainings = await prisma.qualityTraining.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Add slug to each quality training item
    const qualityTrainingsWithSlug = qualityTrainings.map(qualityTraining => ({
      ...qualityTraining,
      slug: createSlug(qualityTraining.title)
    }))

    return NextResponse.json(qualityTrainingsWithSlug)
  } catch (error) {
    // Graceful fallback when DB is unreachable or env missing
    const isDbConnectivityIssue = error instanceof Error && (
      error.message.includes("Can't reach database server") ||
      error.message.includes('Invalid `prisma') ||
      error.name.includes('Prisma')
    )

    if (isDbConnectivityIssue || !process.env.DATABASE_URL) {
      // Minimal mocked list so UI renders
      const fallback = [
        { id: '1', title: 'Quality Training 1', description: 'Fallback item', createdAt: new Date().toISOString(), slug: 'quality-training-1' },
        { id: '2', title: 'Quality Training 2', description: 'Fallback item', createdAt: new Date().toISOString(), slug: 'quality-training-2' },
      ]
      return NextResponse.json(fallback, { status: 503 })
    }

    console.error('Error fetching quality trainings:', error)
    return NextResponse.json({ error: 'Failed to fetch quality trainings' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

