import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { BrandTracerContent } from "@/components/agents/products/BrandTracerContent"

interface BrandTracerPageProps {
  params: {
    brandName: string
  }
}

export default async function BrandTracerPage({ params }: BrandTracerPageProps) {
  const { brandName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <BrandTracerContent brandName={decodedBrandName} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

