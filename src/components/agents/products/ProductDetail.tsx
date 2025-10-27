"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Star, 
  Package, 
  Calendar, 
  User, 
  Info, 
  ShoppingBag,
  Layers,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface DetailProduk {
  id: string
  name: string
  detail: string
  images: string[]
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  status: string
  kapasitas: string | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  updatedBy: string | null
  updateNotes: string | null
  detailProduks: DetailProduk[]
}

interface ProductDetailProps {
  brandName?: string
  brandId?: string
  categoryId: string
  subcategoryId?: string
  productId: string
}

export function ProductDetail({ brandName, brandId, categoryId, subcategoryId, productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error loading product</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Product not found</p>
        </div>
      </div>
    )
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />
      case 'NEW':
        return <Star className="h-4 w-4" />
      case 'REVAMP':
        return <AlertCircle className="h-4 w-4" />
      case 'DISCONTINUE':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <div className="flex items-center space-x-4">
            <Badge 
              variant="outline" 
              className={`status-badge ${getStatusColor(product.status)}`}
            >
              {getStatusIcon(product.status)}
              <span className="ml-1">{product.status}</span>
            </Badge>
            {product.kapasitas && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                <Package className="h-3 w-3 mr-1" />
                {product.kapasitas}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative h-16 w-full rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Description */}
          {product.description && (
            <Card className="p-6 card-hover-effect">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-[#0259b7]" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </Card>
          )}

          {/* Product Details */}
          {product.detailProduks && product.detailProduks.length > 0 && (
            <Card className="p-6 card-hover-effect">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-[#0259b7]" />
                  Product Details
                </h3>
                <div className="space-y-4">
                  {product.detailProduks.map((detail) => (
                    <div key={detail.id} className="border-l-4 border-[#0259b7] pl-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {detail.name}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {detail.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-[#0259b7]" />
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {product.createdBy && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Created By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {product.createdBy}
                      </p>
                    </div>
                  </div>
                )}
                {product.updatedBy && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Updated By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {product.updatedBy}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {product.updateNotes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">
                    Update Notes
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {product.updateNotes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
