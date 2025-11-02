import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SOPList } from "@/components/agents/sop/SOPList"

interface KategoriSOPPageProps {
  params: {
    kategoriSOP: string
  }
}

export default async function KategoriSOPPage({ params }: KategoriSOPPageProps) {
  const { kategoriSOP } = await params
  const decodedKategoriSOP = decodeURIComponent(kategoriSOP).replace(/-/g, ' ')

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen mt-15 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <SOPList kategoriSOP={decodedKategoriSOP} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
