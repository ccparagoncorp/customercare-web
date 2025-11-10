import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SubcategoryTracerContent } from "@/components/agents/products/SubcategoryTracerContent"

interface SubcategoryTracerPageProps {
  params: {
    brandName: string
    categoryName: string
    subcategoryName: string
  }
}

export default async function SubcategoryTracerPage({ params }: SubcategoryTracerPageProps) {
  const { brandName, categoryName, subcategoryName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
  const decodedSubcategoryName = decodeURIComponent(subcategoryName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <SubcategoryTracerContent 
              brandName={decodedBrandName} 
              categoryName={decodedCategoryName}
              subcategoryName={decodedSubcategoryName}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

