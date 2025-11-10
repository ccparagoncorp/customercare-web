"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Brand {
  id: string
  name: string
  description: string | null
  images: string[]
  kategoriProduks: {
    id: string
    name: string
    subkategoriProduks: {
      id: string
      name: string
      produks: {
        id: string
        name: string
        status: string
      }[]
    }[]
  }[]
}

interface BrandHeaderProps {
  brandName: string
}

export function BrandHeader({ brandName }: BrandHeaderProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`)
        
        if (response.ok) {
          const data = await response.json()
          setBrand(data)
        } else if (response.status === 503) {
          // Service unavailable - database connection issue
          setError('Database connection unavailable. Please try again later.')
          console.warn('Database connection issue when fetching brand')
        } else if (response.status === 404) {
          setError('Brand not found')
        } else {
          const errorData = await response.json().catch(() => ({}))
          setError(errorData.error || 'Failed to fetch brand')
        }
      } catch (err) {
        console.error('Error fetching brand:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching brand')
      } finally {
        setLoading(false)
      }
    }

    fetchBrand()
  }, [brandName])

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/agent/products" className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Products</span>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
            <Skeleton className="h-40 w-40 rounded-3xl bg-white/20" />
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <Skeleton className="h-12 w-80 bg-white/20 mx-auto lg:mx-0" />
              <Skeleton className="h-6 w-full bg-white/20" />
              <Skeleton className="h-6 w-3/4 bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600"></div>
        <div className="relative z-10 p-8 lg:p-12 text-center">
          <div className="flex items-center justify-between mb-8">
            <Link href="/agent/products" className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Products</span>
            </Link>
          </div>
          <div className="text-white">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-2xl font-bold mb-2">Brand Not Found</h1>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>

      <div className="relative z-10 p-8 lg:p-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/agent/products" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white/80 hover:bg-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>
        </div>

        {/* Brand Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Brand Logo */}
          <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-white shadow-lg">
            {brand.images && brand.images.length > 0 ? (
              <Image
                src={brand.images[0]}
                alt={brand.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Package className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Brand Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {brand.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
