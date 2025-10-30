import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { CategoryBackgroundSection } from "@/components/agents/products/CategoryBackgroundSection"
import { ModernSubcategoryGrid } from "@/components/agents/products/ModernSubcategoryGrid"
import { CategoryContentWrapper } from "@/components/agents/products/CategoryContentWrapper"
import { CategoryDescriptionSection } from "@/components/agents/products/CategoryDescriptionSection"

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
        <div className="min-h-screen mt-15 bg-gray-50">
          {/* Background Image Section - Full Width */}
          <CategoryBackgroundSection 
            brandName={decodedBrandName} 
            categoryName={decodedCategoryName} 
          />

          {/* Category Description Section */}
          <CategoryDescriptionSection brandName={decodedBrandName} categoryName={decodedCategoryName} />
          
          {/* Main Content */}
          <CategoryContentWrapper brandName={decodedBrandName} categoryName={decodedCategoryName} />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
