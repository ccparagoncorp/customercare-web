"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import productsContent from "@/content/products.json"

interface Brand {
  id: string
  name: string
  images: string[]
}

export default function ProductsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        if (response.ok) {
          const data = await response.json()
          setBrands(data)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="p-6 mt-12">
            <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{productsContent.products.title}</h1>
                <p className="text-xl text-[#ffde59]">{productsContent.products.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 mt-12 mx-48 my-24">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-4xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>

                </div>
              ))}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="p-6 mt-12">
          <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{productsContent.products.title}</h1>
              <p className="text-xl text-[#ffde59]">{productsContent.products.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 mx-48 my-24">
            {brands.map((brand) => (
              <Link key={brand.id} href={`/agent/products/${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                <div className="bg-white rounded-4xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 cursor-pointer">
                  {/* Brand Image */}
                  <div className="aspect-square relative bg-white">
                    {brand.images && brand.images.length > 0 ? (
                      <Image
                        src={brand.images[0]}
                        alt={brand.name}
                        fill
                        className="object-contain p-8 hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-lg font-medium">{brand.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
