import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Layout } from "@/components/agents"
import { KnowledgeTracerContent } from "@/components/agents/KnowledgeTracerContent"

interface KnowledgeTracerPageProps {
  params: Promise<{ knowledgeSlug: string }>
}

export default async function KnowledgeTracerPage({ params }: KnowledgeTracerPageProps) {
  const { knowledgeSlug } = await params
  const decodedKnowledgeSlug = decodeURIComponent(knowledgeSlug)

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <KnowledgeTracerContent knowledgeSlug={decodedKnowledgeSlug} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

