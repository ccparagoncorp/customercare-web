import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const prisma = createPrismaClient()

    // Get month filter from query params (format: YYYY-MM)
    const { searchParams } = new URL(request.url)
    const monthFilter = searchParams.get('month')

    // Parse month filter
    let startDate: Date | null = null
    let endDate: Date | null = null

    if (monthFilter) {
      const [year, month] = monthFilter.split('-').map(Number)
      // month is 1-indexed (1-12), but Date constructor uses 0-indexed (0-11)
      startDate = new Date(year, month - 1, 1, 0, 0, 0, 0) // First day of month at 00:00:00
      // new Date(year, month, 0) gives last day of month-1 (0-indexed)
      // So for month (1-indexed), new Date(year, month, 0) gives last day of selected month
      endDate = new Date(year, month, 0, 23, 59, 59, 999) // Last moment of the selected month
    }

    // Get all agents with their performances - optimized: select only needed fields
    const agents = await prisma.agent.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        foto: true,
        category: true,
        performances: {
          where: monthFilter && startDate && endDate
            ? {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                }
              }
            : undefined,
          select: {
            qaScore: true,
            quizScore: true,
            typingTestScore: true
          }
        }
      }
    })

    // Calculate overall score for each agent
    const agentsWithScores = agents.map(agent => {
      const performances = agent.performances || []
      
      if (performances.length === 0) {
        return {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          foto: agent.foto,
          category: agent.category,
          overallScore: 0,
          averageScores: {
            qaScore: 0,
            quizScore: 0,
            typingTestScore: 0
          }
        }
      }

      // Calculate average scores
      const avgQAScore = Math.round(
        performances.reduce((sum, p) => sum + p.qaScore, 0) / performances.length
      )
      const avgQuizScore = Math.round(
        performances.reduce((sum, p) => sum + p.quizScore, 0) / performances.length
      )
      const avgTypingTestScore = Math.round(
        performances.reduce((sum, p) => sum + p.typingTestScore, 0) / performances.length
      )

      // Calculate overall score as percentage (average of all three scores)
      const overallScore = Math.round((avgQAScore + avgQuizScore + avgTypingTestScore) / 3)
      
      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        foto: agent.foto,
        category: agent.category,
        overallScore,
        averageScores: {
          qaScore: avgQAScore,
          quizScore: avgQuizScore,
          typingTestScore: avgTypingTestScore
        }
      }
    })

    // Group agents by category
    const agentsByCategory = agentsWithScores.reduce((acc, agent) => {
      const category = agent.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(agent)
      return acc
    }, {} as Record<string, typeof agentsWithScores>)

    // Get top 3 for each category (for podium)
    const topAgentsByCategory: Record<string, typeof agentsWithScores> = {}
    // Get all agents sorted by overall score for each category (for table)
    const allAgentsByCategory: Record<string, typeof agentsWithScores> = {}
    
    for (const [category, categoryAgents] of Object.entries(agentsByCategory)) {
      const sortedAgents = categoryAgents.sort((a, b) => b.overallScore - a.overallScore)
      topAgentsByCategory[category] = sortedAgents.slice(0, 3)
      allAgentsByCategory[category] = sortedAgents
    }

    await prisma.$disconnect()

    return NextResponse.json({
      topAgentsByCategory,
      allAgentsByCategory
    })
  } catch (error) {
    console.error('Error fetching top agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top agents' },
      { status: 500 }
    )
  }
}

