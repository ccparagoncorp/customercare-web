"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Layers, ArrowRight, Star, TrendingUp, Eye } from "lucide-react"

interface Subcategory {
  id: string
  name: string
  description: string | null
  images: string[]
  produks: {
    id: string
    name: string
    status: string
  }[]
}

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  status: string
  kapasitas: string | null
}

interface Category {
  id: string
  name: string
  description: string | null
  subkategoriProduks: Subcategory[]
}

interface ModernSubcategoryGridProps {
  brandName: string
  categoryName: string
}

export function ModernSubcategoryGrid({ brandName, categoryName }: ModernSubcategoryGridProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (!response.ok) {
          throw new Error('Failed to fetch category')
        }
        const data = await response.json()
        setCategory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [brandName, categoryName])

  if (loading) {
    return (
      <div className="space-y-8">
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
            <h3 className="text-xl font-bold mb-2">Error loading subcategories</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-gray-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Category not found</h3>
          </div>
        </div>
      </div>
    )
  }

  // If there are subcategories, show them
  if (category.subkategoriProduks && category.subkategoriProduks.length > 0) {
    return (
      <div className="space-y-8">
        {/* Modern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.subkategoriProduks.map((subcategory) => {
            const totalProducts = subcategory.produks?.length || 0

            return (
              <Link key={subcategory.id} href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategory.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    {subcategory.images && subcategory.images.length > 0 ? (
                      <Image
                        src={subcategory.images[0]}
                        alt={subcategory.name}
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
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                        <Layers className="h-3 w-3 inline mr-1" />
                        Subcategory
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {subcategory.name}
                    </h3>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        <span>{totalProducts} Products</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium">
                      <Eye className="h-4 w-4 mr-2" />
                      View Products
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

  // If no subcategories, show products directly
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.subkategoriProduks.flatMap(subcategory => 
          subcategory.produks.map(product => (
            <Link key={product.id} href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategory.name.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`}>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                      product.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                      product.status === 'REVAMP' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <Star className="h-3 w-3 inline mr-1" />
                      {product.status}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-2">
                    {product.name}
                  </h3>
                </div>

                {/* Hover Action */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-center w-full py-2 px-4 bg-green-600 text-white rounded-lg text-sm font-medium">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
