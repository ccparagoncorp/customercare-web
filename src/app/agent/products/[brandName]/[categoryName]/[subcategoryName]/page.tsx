import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SubcategoryHeader } from "@/components/agents/products/SubcategoryHeader"
import { ModernProductGrid } from "@/components/agents/products/ModernProductGrid"

interface SubcategoryPageProps {
  params: {
    brandName: string
    categoryName: string
    subcategoryName: string
  }
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  // Await params and decode the names from URL
  const { brandName, categoryName, subcategoryName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
  const decodedSubcategoryName = decodeURIComponent(subcategoryName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Subcategory Header Section - Full Width */}
          <SubcategoryHeader 
            brandName={decodedBrandName}
            categoryName={decodedCategoryName}
            subcategoryName={decodedSubcategoryName}
          />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
            {/* Products Section */}
            <section className="space-y-16">
              <ModernProductGrid 
                brandName={decodedBrandName}
                categoryName={decodedCategoryName}
                subcategoryName={decodedSubcategoryName}
              />
            </section>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
