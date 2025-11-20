import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

// Cache knowledges for 5 minutes - data rarely changes
const getCachedKnowledges = unstable_cache(
  async () => {
    const prisma = createPrismaClient()
    try {
      const knowledges = await prisma.knowledge.findMany({
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

      // Add slug to each knowledge item
      const knowledgesWithSlug = knowledges.map(knowledge => ({
        ...knowledge,
        slug: createSlug(knowledge.title)
      }))

      await prisma.$disconnect()
      return knowledgesWithSlug
    } catch (error) {
      await prisma.$disconnect().catch(() => {})
      throw error
    }
  },
  ['knowledges-list'],
  {
    revalidate: 300, // 5 minutes
    tags: ['knowledges']
  }
)

export async function GET() {
  try {
    const knowledges = await getCachedKnowledges()
    return NextResponse.json(knowledges)
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
        { id: '1', title: 'Vocabulary', description: 'Fallback item', createdAt: new Date().toISOString(), slug: 'vocabulary' },
        { id: '2', title: 'Product Guide', description: 'Fallback item', createdAt: new Date().toISOString(), slug: 'product-guide' },
      ]
      return NextResponse.json(fallback, { status: 503 })
    }

    console.error('Error fetching knowledges:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledges' }, { status: 500 })
  }
}
