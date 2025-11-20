"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Package, Star, ShoppingBag } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  status: string
  kapasitas: string | null
  createdAt: string
  updatedAt: string
}

interface Subcategory {
  id: string
  name: string
  description: string | null
  produks: Product[]
}

interface ProductGridProps {
  brandName?: string
  brandId?: string
  categoryId: string
  subcategoryId: string
}

export function ProductGrid({ brandName, brandId, categoryId, subcategoryId }: ProductGridProps) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/subcategories/${subcategoryId}`, {
          // Cache for faster loading
          next: { revalidate: 300 }
        })
        if (response.ok) {
          const data = await response.json()
          setSubcategory(data)
          setLoading(false) // Set false after data is loaded
        } else if (response.status === 503) {
          setError('Database connection unavailable. Please try again later.')
          console.warn('Database connection issue when fetching subcategory')
          setLoading(false)
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || 'Failed to fetch subcategory')
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching subcategory:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchData()
  }, [subcategoryId])

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
          <p className="text-lg font-semibold">Error loading products</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!subcategory) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Subcategory not found</p>
        </div>
      </div>
    )
  }

  if (subcategory.produks.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {subcategory.name} Products
          </h1>
          {subcategory.description && (
            <p className="text-gray-600">{subcategory.description}</p>
          )}
        </div>

        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <ShoppingBag className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">No products available</p>
            <p className="text-sm">This subcategory doesn&apos;t have any products yet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {subcategory.name} Products
        </h1>
        {subcategory.description && (
          <p className="text-gray-600">{subcategory.description}</p>
        )}
        <div className="flex items-center text-sm text-gray-500">
          <Package className="h-4 w-4 mr-1" />
          {subcategory.produks.length} Products Available
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategory.produks.map((product) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'ACTIVE':
                return 'bg-green-100 text-green-700'
              case 'NEW':
                return 'bg-blue-100 text-blue-700'
              case 'REVAMP':
                return 'bg-yellow-100 text-yellow-700'
              case 'DISCONTINUE':
                return 'bg-red-100 text-red-700'
              default:
                return 'bg-gray-100 text-gray-700'
            }
          }

          return (
            <Link key={product.id} href={brandName ? `/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/category/${categoryId}/subcategory/${subcategoryId}/product/${product.id}` : `/agent/products/brand/${brandId}/category/${categoryId}/subcategory/${subcategoryId}/product/${product.id}`}>
              <Card className="group product-card-hover cursor-pointer border-0 product-gradient-bg">
                <div className="p-6">
                  {/* Product Image */}
                  <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant="secondary" 
                        className={`status-badge ${getStatusColor(product.status)}`}
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
                      {product.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      {product.kapasitas && (
                        <p className="text-gray-500 text-xs mt-1">
                          Capacity: {product.kapasitas}
                        </p>
                      )}
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
          )
        })}
      </div>
    </div>
  )
}
