"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { generateColorPalette } from "@/lib/colorUtils"
import { Package, Layers, ArrowRight, Star, Eye } from "lucide-react"

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
  brand?: { colorbase?: string | null }
}

interface ModernSubcategoryGridProps {
  brandName: string
  categoryName: string
  initialCategory?: Category | null
}

export function ModernSubcategoryGrid({ brandName, categoryName, initialCategory }: ModernSubcategoryGridProps) {
  const [category, setCategory] = useState<Category | null>(initialCategory ?? null)
  const [loading, setLoading] = useState(!initialCategory)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory)
      setLoading(false)
      return
    }
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
  }, [brandName, categoryName, initialCategory])

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

  // Resolve palette from brand colorbase if present
  const palette = generateColorPalette(category.brand?.colorbase || "#03438f")

  // If there are subcategories, show them
  if (category.subkategoriProduks && category.subkategoriProduks.length > 0) {
    const subcategoryCount = category.subkategoriProduks.length
    const totalProductsAcrossSubcats = category.subkategoriProduks.reduce((total, s) => total + ((s.produks?.length) || 0), 0)
    return (
      <div className="space-y-16">
        {/* Header - mirror brand categories header */}
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 
              className="text-5xl font-bold bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(to right, ${palette.primary}, ${palette.primaryLight}, ${palette.primaryLighter})`
              }}
            >
              Explore {category.name} Subcategories
            </h2>
          </div>
          {/* Decorative Line */}
          <div className="flex justify-center">
            <div 
              className="h-1 w-32 rounded-full"
              style={{
                background: `linear-gradient(to right, ${palette.primary}, ${palette.primaryLight}, ${palette.primaryLighter})`
              }}
            ></div>
          </div>
          {/* Stats */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" style={{ color: palette.primary }} />
                  <span className="font-semibold">{subcategoryCount} Subcategories</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" style={{ color: palette.primaryLight }} />
                  <span className="font-semibold">{totalProductsAcrossSubcats} Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Grid (match brand grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {category.subkategoriProduks.map((subcategory) => {
            const totalProducts = subcategory.produks?.length || 0

            return (
              <Link key={subcategory.id} href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategory.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                <div
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 border-2 border-gray-100 max-w-xs w-full"
                  onMouseEnter={(e) => { const h3 = e.currentTarget.querySelector('h3') as HTMLElement | null; if (h3) h3.style.color = palette.primary }}
                  onMouseLeave={(e) => { const h3 = e.currentTarget.querySelector('h3') as HTMLElement | null; if (h3) h3.style.color = '' }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {subcategory.images && subcategory.images.length > 0 ? (
                      <Image
                        src={subcategory.images[0]}
                        alt={subcategory.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Layers className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay sama seperti BrandCategories */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(0deg, ${palette.primary}22 0%, transparent 100%)` }}></div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium" style={{ color: palette.primary }}>
                        <Layers className="h-3 w-3 inline mr-1" />
                        Subcategory
                      </div>
                    </div>
                  
                    {/* Floating Stats -- tampil di atas gambar */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            <span className="font-semibold">{totalProducts} Products</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content -- p-6, title bold */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 mb-2">
                        {subcategory.name}
                      </h3>
                    </div>
                  </div>

                  {/* Action Button like BrandCategories (footer) */}
                  <div className="px-6 pb-6">
                    <div 
                      className="flex items-center justify-center w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 group-hover:text-white group-hover:shadow-lg"
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})` }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '' }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Products
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-2" style={{ borderColor: `${palette.primary}1A` }}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(0deg, ${palette.primary}22 0%, transparent 100%)` }}></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${palette.primary}12`, color: palette.primary }}>
                      <Star className="h-3 w-3 inline mr-1" />
                      {product.status}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 mb-2" style={{}}>
                    {product.name}
                  </h3>
                </div>

                {/* Hover Action */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-center w-full py-2 px-4 text-white rounded-lg text-sm font-medium" style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})` }}>
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
