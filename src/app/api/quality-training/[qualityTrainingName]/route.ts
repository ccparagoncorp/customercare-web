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

export async function GET(
  request: Request,
  { params }: { params: { qualityTrainingName: string } }
) {
  const prisma = createPrismaClient()
  
  try {
    const qualityTrainingName = decodeURIComponent(params.qualityTrainingName)
    
    // Find quality training by matching slug
    const allQualityTrainings = await prisma.qualityTraining.findMany({
      include: {
        jenisQualityTrainings: {
          include: {
            detailQualityTrainings: {
              include: {
                subdetailQualityTrainings: true
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    // Find matching quality training by slug
    const qualityTraining = allQualityTrainings.find(qt => 
      createSlug(qt.title) === qualityTrainingName.toLowerCase()
    )

    if (!qualityTraining) {
      return NextResponse.json(
        { error: 'Quality training not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(qualityTraining)
  } catch (error) {
    console.error('Error fetching quality training:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quality training' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

