import { NextRequest, NextResponse } from 'next/server'
import { getKnowledgeBySlug } from '../_lib/getKnowledge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ knowledgeSlug: string }> }
) {
  try {
    const { knowledgeSlug } = await params
    const decodedSlug = decodeURIComponent(knowledgeSlug)
    const data = await getKnowledgeBySlug(decodedSlug)
    const status = data._status === 503 ? 503 : 200
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error('Error fetching knowledge:', error)
    return NextResponse.json(
      { error: 'Knowledge not found' },
      { status: 404 }
    )
  }
}

