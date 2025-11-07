import { NextResponse } from 'next/server'
import { getKnowledgeBySlug } from '../_lib/getKnowledge'

export async function GET() {
  const data = await getKnowledgeBySlug('skin-knowledge')
  const status = data._status === 503 ? 503 : 200
  return NextResponse.json(data, { status })
}


