import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET_NAME = 'foto_agent'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from query parameter
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get the file from form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const prisma = createPrismaClient()

    // Get current agent to check if there's an existing photo
    const agent = await prisma.agent.findUnique({
      where: { id: userId },
      select: { foto: true }
    })

    if (!agent) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename: userId-timestamp.extension
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const fileName = `${userId}-${timestamp}.${fileExtension}`
    const filePath = fileName

    // Delete old photo if exists
    if (agent.foto) {
      try {
        // Extract file path from URL
        const oldFileName = agent.foto.split('/').pop()?.split('?')[0]
        if (oldFileName) {
          await supabaseAdmin.storage
            .from(BUCKET_NAME)
            .remove([oldFileName])
        }
      } catch (error) {
        console.warn('Error deleting old photo:', error)
        // Continue even if deletion fails
      }
    }

    // Upload new photo to Supabase storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Failed to upload photo: ' + uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    const photoUrl = urlData.publicUrl

    // Update agent foto in database
    const updatedAgent = await prisma.agent.update({
      where: { id: userId },
      data: { foto: photoUrl },
      select: {
        id: true,
        foto: true
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      foto: updatedAgent.foto,
      message: 'Photo updated successfully'
    })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

