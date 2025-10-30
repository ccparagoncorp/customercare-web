import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SubcategoryBackgroundSection } from "@/components/agents/products/SubcategoryBackgroundSection"
import { SubcategoryProductListWrapper } from "@/components/agents/products/SubcategoryProductListWrapper"
import { SubcategoryDescriptionSection } from "@/components/agents/products/SubcategoryDescriptionSection"

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
        <div className="min-h-screen mt-15 bg-gray-50">
          {/* Subcategory Background Section - Full Width */}
          <SubcategoryBackgroundSection 
            brandName={decodedBrandName}
            categoryName={decodedCategoryName}
            subcategoryName={decodedSubcategoryName}
          />

          {/* Subcategory Description Section */}
          <SubcategoryDescriptionSection 
            brandName={decodedBrandName}
            categoryName={decodedCategoryName}
            subcategoryName={decodedSubcategoryName}
          />
          
          {/* Main Content */}
          <SubcategoryProductListWrapper 
            brandName={decodedBrandName}
            categoryName={decodedCategoryName}
            subcategoryName={decodedSubcategoryName}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
