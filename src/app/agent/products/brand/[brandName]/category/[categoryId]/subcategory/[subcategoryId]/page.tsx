import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ProductGrid } from "@/components/agents/products/ProductGrid"
import { Breadcrumb } from "@/components/agents/products/Breadcrumb"
import productsContent from "@/content/products.json"

interface SubcategoryPageProps {
  params: {
    brandName: string
    categoryId: string
    subcategoryId: string
  }
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  // Await params and decode the brand name from URL
  const { brandName, categoryId, subcategoryId } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6 mt-14">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productsContent.products.products.title}</h1>
            <p className="text-gray-600">{productsContent.products.products.subtitle}</p>
          </div>
          <Breadcrumb 
            brandName={decodedBrandName} 
            categoryId={params.categoryId} 
            subcategoryId={params.subcategoryId} 
          />
          <ProductGrid 
            brandName={decodedBrandName} 
            categoryId={categoryId} 
            subcategoryId={subcategoryId} 
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
