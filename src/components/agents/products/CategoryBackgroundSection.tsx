"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"
import Link from "next/link"

interface Category {
  id: string
  name: string
  description: string | null
  images: string[]
}

interface Brand {
  id: string
  name: string
  colorbase: string | null
}

interface CategoryBackgroundSectionProps {
  brandName: string
  categoryName: string
}

export function CategoryBackgroundSection({ brandName, categoryName }: CategoryBackgroundSectionProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category by brand and category name
        const categoryResponse = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          setCategory(categoryData)
          setBrand(categoryData.brand)
        } else {
          setError('Category not found')
        }
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
      <div className="relative h-96 w-full overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-40 bg-white/20" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-80 bg-white/20" />
            <Skeleton className="h-6 w-96 bg-white/20" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-red-500 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-8">
            <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to {brandName}</span>
            </Link>
          </div>
          <div className="text-white">
            <Package className="h-16 w-16 mb-4 opacity-80" />
            <h1 className="text-4xl font-bold mb-2">Category Not Found</h1>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate color palette from brand colorbase
  const colorPalette = generateColorPalette(brand?.colorbase || '#03438f')
  
  // Get background image from second index (index 1)
  const backgroundImage = category.images && category.images.length > 1 ? category.images[1] : null

  return (
    <div className="relative h-96 w-full overflow-hidden">
      {/* Background Image */}
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={`${category.name} background`}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.primaryDark} 100%)`
          }}
        ></div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to {brandName}</span>
          </Link>
        </div>
        
        {/* Category Info */}
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-white/90 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
