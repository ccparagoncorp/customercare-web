import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { QualityTrainingTracerContent } from "@/components/agents/QualityTrainingTracerContent"

interface QualityTrainingTracerPageProps {
  params: {
    qualityTrainingName: string
  }
}

export default async function QualityTrainingTracerPage({ params }: QualityTrainingTracerPageProps) {
  const { qualityTrainingName } = await params
  const decodedQualityTrainingName = decodeURIComponent(qualityTrainingName)
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <QualityTrainingTracerContent qualityTrainingName={decodedQualityTrainingName} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

