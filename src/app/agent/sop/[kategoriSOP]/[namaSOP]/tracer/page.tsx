import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SOPTracerContent } from "@/components/agents/sop/SOPTracerContent"

interface SOPTracerPageProps {
  params: {
    kategoriSOP: string
    namaSOP: string
  }
}

export default async function SOPTracerPage({ params }: SOPTracerPageProps) {
  const { kategoriSOP, namaSOP } = await params
  const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')
  const decodedNamaSOP = decodeURIComponent(namaSOP).replace(/-/g, ' ')

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <SOPTracerContent 
              kategoriSOP={decodedKategoriSOP} 
              namaSOP={decodedNamaSOP} 
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

