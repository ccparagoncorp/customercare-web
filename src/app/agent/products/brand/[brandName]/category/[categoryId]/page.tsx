import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { SubcategoryOrProductGrid } from "@/components/agents/products/SubcategoryOrProductGrid"
import { Breadcrumb } from "@/components/agents/products/Breadcrumb"
import productsContent from "@/content/products.json"

interface CategoryPageProps {
  params: {
    brandName: string
    categoryId: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await params and decode the brand name from URL
  const { brandName, categoryId } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6 mt-14">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productsContent.products.subcategories.title}</h1>
            <p className="text-gray-600">{productsContent.products.subcategories.subtitle}</p>
          </div>
          <Breadcrumb brandName={decodedBrandName} categoryId={params.categoryId} />
          <SubcategoryOrProductGrid 
            brandName={decodedBrandName} 
            categoryId={categoryId} 
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
