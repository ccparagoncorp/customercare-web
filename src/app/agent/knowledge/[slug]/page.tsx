import { KnowledgeContent } from '@/components/agents/knowledge/KnowledgeContent'

interface KnowledgePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { slug } = await params
  return <KnowledgeContent slug={slug} />
}


