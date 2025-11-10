import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { KategoriSOPTracerContent } from "@/components/agents/sop/KategoriSOPTracerContent"

interface KategoriSOPTracerPageProps {
  params: {
    kategoriSOP: string
  }
}

export default async function KategoriSOPTracerPage({ params }: KategoriSOPTracerPageProps) {
  const { kategoriSOP } = await params
  const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <KategoriSOPTracerContent kategoriSOP={decodedKategoriSOP} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

