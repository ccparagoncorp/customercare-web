"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Star, ArrowLeft, Info, Calendar, Tag, History } from "lucide-react"
import Link from "next/link"
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

interface Brand {
  id: string
  name: string
  colorbase: string | null
}

interface ProductDetailProps {
  brandName: string
  categoryName: string
  subcategoryName?: string
  productName: string
}

export function ProductDetail({ brandName, categoryName, subcategoryName, productName }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let url = `/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`
        
        if (subcategoryName) {
          url += `/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'))}`
        } else {
          url += `/${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'))}`
        }

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          setBrand(data.subkategoriProduk.kategoriProduk.brand)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [brandName, categoryName, subcategoryName, productName])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-red-500 mb-6">
            <Package className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Product Not Found</h3>
            <p className="text-sm">{error}</p>
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
        return 'bg-green-100 text-green-700 border-green-200'
      case 'NEW':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'REVAMP':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'DISCONTINUE':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getBackUrl = () => {
    if (subcategoryName) {
      return `/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`
    } else {
      return `/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`
    }
  }

  const getTracerUrl = () => {
    const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')
    let url = `/agent/products/${slugify(brandName)}/${slugify(categoryName)}`
    if (subcategoryName) {
      url += `/${slugify(subcategoryName)}/${slugify(productName)}/tracer`
    } else {
      url += `/${slugify(productName)}/tracer`
    }
    return url
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href={getBackUrl()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            Back to {subcategoryName || categoryName}
          </span>
        </Link>
        <Link 
          href={getTracerUrl()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          style={{
            backgroundColor: colorPalette.primary,
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorPalette.primaryDark
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colorPalette.primary
          }}
        >
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Tracer Updates</span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package className="h-24 w-24" />
              </div>
            )}
          </div>
          
          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                <Star className="h-4 w-4 mr-1" />
                {product.status}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2" style={{ color: colorPalette.primary }} />
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Capacity */}
          {product.kapasitas && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" style={{ color: colorPalette.primary }} />
                Capacity
              </h3>
              <p className="text-gray-600">
                {product.kapasitas}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2" style={{ color: colorPalette.primary }} />
              Product Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created
                </div>
                <p className="text-gray-900 font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated
                </div>
                <p className="text-gray-900 font-medium">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}