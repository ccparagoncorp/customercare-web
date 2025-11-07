"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Layers, ArrowRight, Eye } from "lucide-react"

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
  kategoriProduks: Category[]
}

interface BrandCategoriesGridProps {
  brandName: string
  currentCategoryId?: string
}

export function BrandCategoriesGrid({ brandName, currentCategoryId }: BrandCategoriesGridProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (response.ok) {
          const data = await response.json()
          setBrand(data)
        } else {
          setError('Brand not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
        }
      }

    fetchBrand()
  }, [brandName])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 aspect-square">
                <Skeleton className="absolute inset-0" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
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
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-red-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error loading categories</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!brand || brand.kategoriProduks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-gray-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No categories available</h3>
            <p className="text-sm">This brand doesn&apos;t have any categories yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          All Categories in {brand.name}
        </h2>
        <p className="text-gray-600">
          Explore all product categories available in this brand
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brand.kategoriProduks.map((category) => {
          const totalProducts = category.subkategoriProduks.reduce((total, subcategory) => {
            return total + subcategory.produks.length
          }, 0)

          const isCurrentCategory = currentCategoryId === category.id

          return (
            <Link key={category.id} href={`/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/category/${category.id}`}>
              <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                isCurrentCategory 
                  ? 'border-blue-500 shadow-blue-100' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  {category.images && category.images.length > 0 ? (
                    <Image
                      src={category.images[0]}
                      alt={category.name}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <Layers className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Current Category Badge */}
                  {isCurrentCategory && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Current
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      <Layers className="h-3 w-3 inline mr-1" />
                      Category
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isCurrentCategory 
                      ? 'text-blue-600' 
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {category.name}
                  </h3>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      <span>{totalProducts} Products</span>
                    </div>
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-1" />
                      <span>{category.subkategoriProduks.length} Subcategories</span>
                    </div>
                  </div>
                </div>

                {/* Hover Action */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`flex items-center justify-center w-full py-2 px-4 rounded-lg text-sm font-medium ${
                    isCurrentCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <Eye className="h-4 w-4 mr-2" />
                    {isCurrentCategory ? 'Viewing Now' : 'View Category'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
