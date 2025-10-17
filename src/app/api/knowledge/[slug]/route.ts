import { NextResponse } from 'next/server'
import { getKnowledgeBySlug } from '../_lib/getKnowledge'

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const knowledge = await getKnowledgeBySlug(slug)
    const status = (knowledge as any)._status === 503 ? 503 : 200
    return NextResponse.json(knowledge, { status })
  } catch (error) {
    console.error('Error fetching knowledge:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge' }, { status: 500 })
  }
}
