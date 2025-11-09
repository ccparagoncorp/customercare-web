import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CategoryTracerContent } from "@/components/agents/products/CategoryTracerContent"

interface CategoryTracerPageProps {
  params: {
    brandName: string
    categoryName: string
  }
}

export default async function CategoryTracerPage({ params }: CategoryTracerPageProps) {
  const { brandName, categoryName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <CategoryTracerContent 
              brandName={decodedBrandName} 
              categoryName={decodedCategoryName} 
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

