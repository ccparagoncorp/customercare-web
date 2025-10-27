import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ProductDetail } from "@/components/agents/products/ProductDetail"
import { Breadcrumb } from "@/components/agents/products/Breadcrumb"
import productsContent from "@/content/products.json"

interface CategoryProductPageProps {
  params: {
    brandName: string
    categoryId: string
    productId: string
  }
}

export default async function CategoryProductPage({ params }: CategoryProductPageProps) {
  // Await params and decode the brand name from URL
  const { brandName, categoryId, productId } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6 mt-14">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productsContent.products.productDetail.title}</h1>
            <p className="text-gray-600">{productsContent.products.productDetail.subtitle}</p>
          </div>
          <Breadcrumb 
            brandName={decodedBrandName} 
            categoryId={params.categoryId} 
            productId={params.productId} 
          />
          <ProductDetail 
            brandName={decodedBrandName} 
            categoryId={categoryId} 
            subcategoryId="" 
            productId={productId} 
          />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
