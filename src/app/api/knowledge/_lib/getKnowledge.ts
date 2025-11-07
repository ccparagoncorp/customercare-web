import { createPrismaClient } from '@/lib/db'

function toTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

interface ProdukJenisDetailKnowledge {
  id: string
  name: string
  description: string | null
  logos: string[]
}

interface JenisDetailKnowledge {
  id: string
  name: string
  description: string | null
  logos: string[]
  produkJenisDetailKnowledges: ProdukJenisDetailKnowledge[]
}

interface DetailKnowledge {
  id: string
  name: string
  description: string | null
  logos: string[]
  jenisDetailKnowledges: JenisDetailKnowledge[]
}

interface KnowledgeResult {
  id: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  createdBy: string | null
  updatedBy: string | null
  logos: string[]
  updateNotes: string | null
  detailKnowledges: DetailKnowledge[]
  _status?: number
}

export async function getKnowledgeBySlug(slug: string): Promise<KnowledgeResult> {
  const prisma = createPrismaClient()
  
  try {
    const knowledges = await prisma.knowledge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        logos: true,
        updateNotes: true,
        detailKnowledges: {
          select: {
            id: true,
            name: true,
            description: true,
            logos: true,
            jenisDetailKnowledges: {
              select: {
                id: true,
                name: true,
                description: true,
                logos: true,
                produkJenisDetailKnowledges: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    logos: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const knowledge = knowledges.find(k => k.title && toTitle(slug).toLowerCase() === k.title.toLowerCase())
    if (knowledge) return knowledge

    // Title matching not found; fallback by best-effort
    throw new Error('NOT_FOUND')
  } catch (error: unknown) {
    const errorObj = error as { message?: string; name?: string }
    const isDbIssue = errorObj?.message?.includes("Can't reach database server") || errorObj?.name?.includes('Prisma')
    if (isDbIssue || !process.env.DATABASE_URL) {
      return {
        id: 'fallback',
        title: toTitle(slug),
        description: 'Content unavailable (database not reachable). This is a temporary fallback.',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
        logos: [],
        updateNotes: null,
        detailKnowledges: [],
        _status: 503,
      }
    }
    throw error
  } finally {
    await prisma.$disconnect()
  }
}


