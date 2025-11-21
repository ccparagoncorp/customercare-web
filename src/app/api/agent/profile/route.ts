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

    // Get agent data from database - optimized: select only needed fields
    const agent = await prisma.agent.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        foto: true,
        category: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        performances: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 10, // Get last 10 performances
          select: {
            id: true,
            qaScore: true,
            quizScore: true,
            typingTestScore: true,
            timestamp: true
          }
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

    await prisma.$disconnect()

    return NextResponse.json({
      ...agent,
      performances: performances.map(p => ({
        ...p,
        timestamp: p.timestamp.toISOString()
      })),
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

      // Import Supabase admin for password update
      const { createClient } = require('@supabase/supabase-js')
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
        const bcrypt = require('bcryptjs')
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
        const { createClient } = require('@supabase/supabase-js')
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

