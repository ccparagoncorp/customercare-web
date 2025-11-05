import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { JenisSOPDetail } from "@/components/agents/sop/JenisSOPDetail"

interface NamaSOPPageProps {
  params: {
    kategoriSOP: string
    namaSOP: string
  }
}

export default async function NamaSOPPage({ params }: NamaSOPPageProps) {
  const { kategoriSOP, namaSOP } = await params
  const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')
  const decodedNamaSOP = decodeURIComponent(namaSOP).replace(/-/g, ' ')

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen mt-12">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <JenisSOPDetail 
              kategoriSOP={decodedKategoriSOP} 
              namaSOP={decodedNamaSOP} 
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
