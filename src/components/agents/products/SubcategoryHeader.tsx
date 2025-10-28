"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ArrowLeft, Layers, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { generateColorPalette } from "@/lib/colorUtils"

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

interface Brand {
  id: string
  name: string
  colorbase: string | null
}

interface SubcategoryHeaderProps {
  brandName: string
  categoryName: string
  subcategoryName: string
}

export function SubcategoryHeader({ brandName, categoryName, subcategoryName }: SubcategoryHeaderProps) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subcategory by names
        const subcategoryResponse = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (subcategoryResponse.ok) {
          const subcategoryData = await subcategoryResponse.json()
          setSubcategory(subcategoryData)
          setBrand(subcategoryData.kategoriProduk.brand)
        } else {
          setError('Subcategory not found')
        }
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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-40 bg-white/60" />
          </div>
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
            <Skeleton className="h-32 w-32 rounded-2xl bg-white/60" />
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <Skeleton className="h-12 w-80 bg-white/60 mx-auto lg:mx-0" />
              <Skeleton className="h-6 w-full bg-white/60" />
              <Skeleton className="h-6 w-3/4 bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !subcategory) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50"></div>
        <div className="relative z-10 p-8 lg:p-12 text-center">
          <div className="flex items-center justify-between mb-8">
            <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white/80 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to {categoryName}</span>
            </Link>
          </div>
          <div className="text-gray-700">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-2xl font-bold mb-2">Subcategory Not Found</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate color palette from brand colorbase
  const colorPalette = generateColorPalette(brand?.colorbase || '#03438f')
  
  const totalProducts = subcategory.produks.length
  const activeProducts = subcategory.produks.filter(p => p.status === 'ACTIVE').length

  return (
    <div className="relative overflow-hidden">
      {/* Professional Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.bgPrimary}, ${colorPalette.bgSecondary})`
        }}
      ></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white/80 hover:bg-white shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to {categoryName}</span>
          </Link>
        </div>

        {/* Subcategory Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Subcategory Image */}
          <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
            {subcategory.images && subcategory.images.length > 0 ? (
              <Image
                src={subcategory.images[0]}
                alt={subcategory.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Layers className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Subcategory Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {subcategory.name}
              </h1>
              {subcategory.description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {subcategory.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <div className="flex items-center text-gray-600 bg-white/60 px-3 py-2 rounded-lg">
                <Package className="h-4 w-4 mr-2" style={{ color: colorPalette.primary }} />
                <span className="font-medium">{totalProducts} Total Products</span>
              </div>
              <div className="flex items-center text-gray-600 bg-white/60 px-3 py-2 rounded-lg">
                <Star className="h-4 w-4 mr-2" style={{ color: colorPalette.primaryLight }} />
                <span className="font-medium">{activeProducts} Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}