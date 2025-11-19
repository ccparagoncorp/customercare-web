import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter (passed from client)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const prisma = createPrismaClient()

    // Get agent data from database
    const agent = await prisma.agent.findUnique({
      where: { id: userId },
      include: {
        performances: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 10 // Get last 10 performances
        }
      }
    })

    if (!agent) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Calculate average scores
    const performances = agent.performances || []
    const avgQAScore = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.qaScore, 0) / performances.length)
      : 0
    const avgQuizScore = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.quizScore, 0) / performances.length)
      : 0
    const avgTypingTestScore = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.typingTestScore, 0) / performances.length)
      : 0

    // Remove password from response
    const { password, ...agentWithoutPassword } = agent

    await prisma.$disconnect()

    return NextResponse.json({
      ...agentWithoutPassword,
      averageScores: {
        qaScore: avgQAScore,
        quizScore: avgQuizScore,
        typingTestScore: avgTypingTestScore
      }
    })
  } catch (error) {
    console.error('Error fetching agent profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

