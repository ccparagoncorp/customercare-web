"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Star, ArrowRight, Eye, TrendingUp, Zap } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"

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

interface Brand {
  id: string
  name: string
  colorbase: string | null
}

interface ModernProductGridProps {
  brandName: string
  categoryName: string
  subcategoryName: string
}

export function ModernProductGrid({ brandName, categoryName, subcategoryName }: ModernProductGridProps) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (!response.ok) {
          throw new Error('Failed to fetch subcategory')
        }
        const data = await response.json()
        setSubcategory(data)
        setBrand(data.kategoriProduk.brand)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [brandName, categoryName, subcategoryName])

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
            <h3 className="text-xl font-bold mb-2">Error loading products</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!subcategory) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-gray-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Subcategory not found</h3>
          </div>
        </div>
      </div>
    )
  }

  if (subcategory.produks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-gray-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No products available</h3>
            <p className="text-sm">This subcategory doesn't have any products yet</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate color palette from brand colorbase
  const colorPalette = generateColorPalette(brand?.colorbase || '#03438f')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return `bg-green-100 text-green-700 border-green-200`
      case 'NEW':
        return `bg-blue-100 text-blue-700 border-blue-200`
      case 'REVAMP':
        return `bg-yellow-100 text-yellow-700 border-yellow-200`
      case 'DISCONTINUE':
        return `bg-red-100 text-red-700 border-red-200`
      default:
        return `bg-gray-100 text-gray-700 border-gray-200`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <TrendingUp className="h-3 w-3" />
      case 'NEW':
        return <Zap className="h-3 w-3" />
      case 'REVAMP':
        return <Star className="h-3 w-3" />
      default:
        return <Package className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Modern Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subcategory.produks.map((product) => (
          <Link key={product.id} href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`}>
            <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{product.status}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                {product.kapasitas && (
                  <div className="flex items-center text-gray-500 text-xs mb-2">
                    <Package className="h-3 w-3 mr-1" />
                    <span>Capacity: {product.kapasitas}</span>
                  </div>
                )}
              </div>

              {/* Hover Action */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div 
                  className="flex items-center justify-center w-full py-2 px-4 text-white rounded-lg text-sm font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.primaryDark})`
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}