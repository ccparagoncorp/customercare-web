"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, ArrowLeft, Layers, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

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

interface CategoryHeaderProps {
  categoryId: string
  brandName: string
}

export function CategoryHeader({ categoryId, brandName }: CategoryHeaderProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)
        } else {
          setError('Category not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [categoryId])

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100"></div>
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

  if (error || !category) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50"></div>
        <div className="relative z-10 p-8 lg:p-12 text-center">
          <div className="flex items-center justify-between mb-8">
            <Link href={`/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white/80 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Brand</span>
            </Link>
          </div>
          <div className="text-gray-700">
            <Package className="h-16 w-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const totalProducts = category.subkategoriProduks.reduce((total, subcategory) => {
    return total + subcategory.produks.length
  }, 0)

  const totalSubcategories = category.subkategoriProduks.length

  return (
    <div className="relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg bg-white/80 hover:bg-white shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to {brandName}</span>
          </Link>
        </div>

        {/* Category Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Category Image */}
          <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
            {category.images && category.images.length > 0 ? (
              <Image
                src={category.images[0]}
                alt={category.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Layers className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {category.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <div className="flex items-center text-gray-600 bg-white/60 px-3 py-2 rounded-lg">
                <Layers className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">{totalSubcategories} Subcategories</span>
              </div>
              <div className="flex items-center text-gray-600 bg-white/60 px-3 py-2 rounded-lg">
                <Package className="h-4 w-4 mr-2 text-green-600" />
                <span className="font-medium">{totalProducts} Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
