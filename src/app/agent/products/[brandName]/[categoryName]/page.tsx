import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CategoryBackgroundSection } from "@/components/agents/products/CategoryBackgroundSection"
import { ModernSubcategoryGrid } from "@/components/agents/products/ModernSubcategoryGrid"

interface CategoryPageProps {
  params: {
    brandName: string
    categoryName: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await params and decode the names from URL
  const { brandName, categoryName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Background Image Section - Full Width */}
          <CategoryBackgroundSection 
            brandName={decodedBrandName} 
            categoryName={decodedCategoryName} 
          />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
            {/* Subcategories Section */}
            <section className="space-y-16">
              <ModernSubcategoryGrid brandName={decodedBrandName} categoryName={decodedCategoryName} />
            </section>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
