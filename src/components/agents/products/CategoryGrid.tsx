"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ArrowRight, Sparkles, Zap } from "lucide-react"
import productsContent from "@/content/products.json"

interface Category {
  id: string
  name: string
  description: string | null
  images: string[]
  subkategoriProduks: {
    id: string
    name: string
    produks: {
      id: string
      name: string
      status: string
    }[]
  }[]
}

interface Brand {
  id: string
  name: string
  description: string | null
}

interface CategoryGridProps {
  brandName?: string
  brandId?: string
}

export function CategoryGrid({ brandName, brandId }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (brandName) {
          // Fetch brand info by name
          const brandResponse = await fetch(`/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`)
          if (brandResponse.ok) {
            const brandData = await brandResponse.json()
            setBrand(brandData)
            setCategories(brandData.kategoriProduks)
          }
        } else if (brandId) {
          // Fetch brand info by ID - convert to name-based lookup
          const brandResponse = await fetch(`/api/brands`)
          if (brandResponse.ok) {
            const brandsData = await brandResponse.json()
            const brandData = brandsData.find((b: any) => b.id === brandId)
            if (brandData) {
              setBrand(brandData)
              setCategories(brandData.kategoriProduks)
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [brandName, brandId])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                <Skeleton className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-red-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error loading categories</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 max-w-md mx-auto">
          <div className="text-gray-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No categories available</h3>
            <p className="text-sm">This brand doesn't have any product categories yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {categories.map((category, index) => {
        const totalProducts = category.subkategoriProduks.reduce((total, subkategori) => {
          return total + subkategori.produks.length
        }, 0)

        return (
          <Link 
            key={category.id} 
            href={brandName ? `/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/category/${category.id}` : `/agent/products/brand/${brandId}/category/${category.id}`}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              {/* Category Image */}
              <div className="relative aspect-square overflow-hidden">
                {category.images && category.images.length > 0 ? (
                  <Image
                    src={category.images[0]}
                    alt={category.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
              </div>

              {/* Category Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
