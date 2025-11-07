"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Package, Layers, Star, ShoppingBag } from "lucide-react"

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

interface Category {
  id: string
  name: string
  description: string | null
  subkategoriProduks: Subcategory[]
}

interface SubcategoryOrProductGridProps {
  brandName?: string
  brandId?: string
  categoryId: string
}

export function SubcategoryOrProductGrid({ brandName, brandId, categoryId }: SubcategoryOrProductGridProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`)
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
  }, [categoryId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-32 w-full mb-4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error loading category</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Category not found</p>
        </div>
      </div>
    )
  }

  // If there are subcategories, show them
  if (category.subkategoriProduks.length > 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {category.name} Subcategories
          </h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subkategoriProduks.map((subcategory) => {
            const totalProducts = subcategory.produks.length

            return (
              <Link key={subcategory.id} href={brandName ? `/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/category/${categoryId}/subcategory/${subcategory.id}` : `/agent/products/brand/${brandId}/category/${categoryId}/subcategory/${subcategory.id}`}>
                <Card className="group product-card-hover cursor-pointer border-0 product-gradient-bg">
                  <div className="p-6">
                    {/* Subcategory Image */}
                    <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {subcategory.images && subcategory.images.length > 0 ? (
                        <Image
                          src={subcategory.images[0]}
                          alt={subcategory.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Layers className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          <Layers className="h-3 w-3 mr-1" />
                          Subcategory
                        </Badge>
                      </div>
                    </div>

                    {/* Subcategory Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors">
                          {subcategory.name}
                        </h3>
                        {subcategory.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {subcategory.description}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            {totalProducts} Products
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <div className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white rounded-lg group-hover:shadow-lg transition-all duration-300">
                          <span className="text-sm font-medium">View Products</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // If no subcategories, show products directly
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {category.name} Products
        </h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subkategoriProduks.flatMap(subcategory => 
          subcategory.produks.map(product => (
            <Link key={product.id} href={brandName ? `/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/category/${categoryId}/product/${product.id}` : `/agent/products/brand/${brandId}/category/${categoryId}/product/${product.id}`}>
              <Card className="group product-card-hover cursor-pointer border-0 product-gradient-bg">
                <div className="p-6">
                  {/* Product Image */}
                  <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="flex items-center justify-center h-full">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={product.status === 'ACTIVE' ? 'default' : 'secondary'} 
                        className={product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {product.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <div className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white rounded-lg group-hover:shadow-lg transition-all duration-300">
                        <span className="text-sm font-medium">View Details</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
