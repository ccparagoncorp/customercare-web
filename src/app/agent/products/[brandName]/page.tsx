import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { BrandBackgroundSection } from "@/components/agents/products/BrandBackgroundSection"
import { ModernBrandCategories } from "@/components/agents/products/ModernBrandCategories"
import { BrandGallery } from "@/components/agents/products/BrandGallery"
import { BrandDescriptionSection } from "@/components/agents/products/BrandDescriptionSection"

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
        <div className="min-h-screen mt-15 bg-white">
          {/* Background Image Section - Full Width */}
          <BrandBackgroundSection brandName={decodedBrandName} />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {/* Brand Description Section */}
          <BrandDescriptionSection brandName={decodedBrandName} />

            {/* All Categories in Brand Section */}
            <section className="space-y-16">
              <ModernBrandCategories brandName={decodedBrandName} />
            </section>
            
            {/* Brand Gallery Section */}
            <section className="space-y-16">
              <BrandGallery brandName={decodedBrandName} />
            </section>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
