import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ProductDetail } from "@/components/agents/products/ProductDetail"

interface ProductPageProps {
  params: {
    brandName: string
    categoryName: string
    params: string[]
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params and decode the names from URL
  const { brandName, categoryName, params: routeParams } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')
  
  // Determine if we have subcategory or direct product
  let subcategoryName: string | undefined
  let productName: string
  
  if (routeParams.length === 2) {
    // [subcategoryName, productName]
    subcategoryName = decodeURIComponent(routeParams[0]).replace(/-/g, ' ')
    productName = decodeURIComponent(routeParams[1]).replace(/-/g, ' ')
  } else if (routeParams.length === 1) {
    // [productName] - direct from category
    productName = decodeURIComponent(routeParams[0]).replace(/-/g, ' ')
  } else {
    throw new Error('Invalid route parameters')
  }
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Product Detail Section */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <ProductDetail 
              brandName={decodedBrandName}
              categoryName={decodedCategoryName}
              subcategoryName={subcategoryName}
              productName={productName}
            />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
