import { createPrismaClient } from '@/lib/db'

function toTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function getKnowledgeBySlug(slug: string) {
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
  } catch (error: any) {
    const isDbIssue = error?.message?.includes("Can't reach database server") || error?.name?.includes('Prisma')
    if (isDbIssue || !process.env.DATABASE_URL) {
      return {
        id: 'fallback',
        title: toTitle(slug),
        description: 'Content unavailable (database not reachable). This is a temporary fallback.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: null as any,
        updatedBy: null as any,
        logos: [] as string[],
        updateNotes: undefined as any,
        detailKnowledges: [] as any[],
        _status: 503,
      }
    }
    throw error
  } finally {
    await prisma.$disconnect()
  }
}


