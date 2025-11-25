import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

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
    // Using include instead of select to avoid Prisma Client type issues with new fields
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
    
    // Define performance type
    type PerformanceData = {
      qaScore: number
      quizScore: number
      typingTestScore: number
      afrt: number
      art: number
      rt: number
      rr: number
      csat: number
      qaScoreRemarks?: string | null
      quizScoreRemarks?: string | null
      typingTestScoreRemarks?: string | null
      afrtRemarks?: string | null
      artRemarks?: string | null
      rtRemarks?: string | null
      rrRemarks?: string | null
      csatRemarks?: string | null
      id: string
      timestamp: Date | string
      [key: string]: unknown
    }
    
    // Type-safe access to performance fields with fallback to 0 if field doesn't exist
    const getField = (p: PerformanceData | unknown, field: string): number => {
      if (p && typeof p === 'object' && field in p) {
        const value = (p as Record<string, unknown>)[field]
        return value !== undefined && value !== null ? Number(value) : 0
      }
      return 0
    }
    const getRemarks = (p: PerformanceData | unknown, field: string): string | null => {
      if (p && typeof p === 'object' && field in p) {
        const value = (p as Record<string, unknown>)[field]
        return typeof value === 'string' && value.trim().length > 0 ? value : null
      }
      return null
    }
    const avgQAScore = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'qaScore'), 0) / performances.length)
      : 0
    const avgQuizScore = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'quizScore'), 0) / performances.length)
      : 0
    const avgTypingTestScore = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'typingTestScore'), 0) / performances.length)
      : 0
    const avgAfrt = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'afrt'), 0) / performances.length)
      : 0
    const avgArt = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'art'), 0) / performances.length)
      : 0
    const avgRt = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'rt'), 0) / performances.length)
      : 0
    const avgRr = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'rr'), 0) / performances.length)
      : 0
    const avgCsat = performances.length > 0
      ? Math.round(performances.reduce((sum: number, p: PerformanceData) => sum + getField(p, 'csat'), 0) / performances.length)
      : 0

    await prisma.$disconnect()

    return NextResponse.json({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      nip: agent.nip ?? null,
      tl: agent.tl ?? null,
      qa: agent.qa ?? null,
      foto: agent.foto,
      category: agent.category,
      isActive: agent.isActive,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      performances: performances.map((p: PerformanceData) => ({
        id: p.id,
        qaScore: getField(p, 'qaScore'),
        quizScore: getField(p, 'quizScore'),
        typingTestScore: getField(p, 'typingTestScore'),
        afrt: getField(p, 'afrt'),
        art: getField(p, 'art'),
        rt: getField(p, 'rt'),
        rr: getField(p, 'rr'),
        csat: getField(p, 'csat'),
          qaScoreRemarks: getRemarks(p, 'qaScoreRemarks'),
          quizScoreRemarks: getRemarks(p, 'quizScoreRemarks'),
          typingTestScoreRemarks: getRemarks(p, 'typingTestScoreRemarks'),
          afrtRemarks: getRemarks(p, 'afrtRemarks'),
          artRemarks: getRemarks(p, 'artRemarks'),
          rtRemarks: getRemarks(p, 'rtRemarks'),
          rrRemarks: getRemarks(p, 'rrRemarks'),
          csatRemarks: getRemarks(p, 'csatRemarks'),
        timestamp: p.timestamp ? new Date(p.timestamp).toISOString() : new Date().toISOString()
      })),
      averageScores: {
        qaScore: avgQAScore,
        quizScore: avgQuizScore,
        typingTestScore: avgTypingTestScore,
        afrt: avgAfrt,
        art: avgArt,
        rt: avgRt,
        rr: avgRr,
        csat: avgCsat
      }
    })
  } catch (error: unknown) {
    console.error('Error fetching agent profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    if (errorMessage) {
      console.error('Error details:', errorMessage)
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    const prisma = createPrismaClient()

    // Check if agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: userId }
    })

    if (!agent) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: { name?: string; email?: string } = {}

    // Update name if provided
    if (name && name !== agent.name) {
      updateData.name = name
    }

    // Update email if provided
    if (email && email !== agent.email) {
      // Check if email is already taken
      const existingAgent = await prisma.agent.findUnique({
        where: { email }
      })

      if (existingAgent && existingAgent.id !== userId) {
        await prisma.$disconnect()
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }

      updateData.email = email
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        await prisma.$disconnect()
        return NextResponse.json(
          { error: 'Password saat ini diperlukan untuk mengubah password' },
          { status: 400 }
        )
      }

      // Use Supabase admin for password update
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        })

        // Verify current password first by attempting to sign in
        const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
          email: agent.email,
          password: currentPassword
        })

        if (verifyError || !verifyData.user) {
          await prisma.$disconnect()
          return NextResponse.json(
            { error: 'Password saat ini salah' },
            { status: 400 }
          )
        }

        // Update password in Supabase
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: newPassword }
        )

        if (updateError) {
          console.error('Error updating password:', updateError)
          await prisma.$disconnect()
          return NextResponse.json(
            { error: 'Gagal mengubah password' },
            { status: 500 }
          )
        }
      } else {
        // If Supabase is not configured, update in database directly (fallback)
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.agent.update({
          where: { id: userId },
          data: { password: hashedPassword }
        })
      }
    }

    // Update agent data in database
    if (Object.keys(updateData).length > 0) {
      await prisma.agent.update({
        where: { id: userId },
        data: updateData
      })

      // If email was updated, also update in Supabase Auth
      if (updateData.email) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && supabaseServiceKey) {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            email: updateData.email
          })
        }
      }
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

