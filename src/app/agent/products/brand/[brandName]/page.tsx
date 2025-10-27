import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
// import { BrandHeader } from "@/components/agents/products/BrandHeader"
import { CategoryGrid } from "@/components/agents/products/CategoryGrid"
// import { BrandGallery } from "@/components/agents/products/BrandGallery"
import productsContent from "@/content/products.json"
import { BrandHeader } from "@/components/agents/products/BrandHeader"
import { BrandGallery } from "@/components/agents/products/BrandGallery"

interface BrandPageProps {
  params: {
    brandName: string
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  // Await params and decode the brand name from URL
  const { brandName } = await params
  const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
  
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen">
          {/* Brand Header Section - Full Width */}
          <BrandHeader brandName={decodedBrandName} />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
            {/* Categories Section */}
            <section className="space-y-12">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {productsContent.products.categories.title}
                </h2>
                <p className="text-gray-600">
                  {productsContent.products.categories.subtitle}
                </p>
              </div>
              
              <CategoryGrid brandName={decodedBrandName} />
            </section>
            
            {/* Brand Gallery Section */}
            <section className="space-y-12">
              <BrandGallery brandName={decodedBrandName} />
            </section>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
