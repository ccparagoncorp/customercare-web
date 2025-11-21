"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"  
import { Package, Layers, ArrowRight, Eye, Star } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"

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

interface Brand {
  id: string
  name: string
  colorbase: string | null
  kategoriProduks: Category[]
  description: string | null
}

interface ModernBrandCategoriesProps {
  brandName: string
  currentCategoryName?: string
}

export function ModernBrandCategories({ brandName, currentCategoryName }: ModernBrandCategoriesProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        // API route already has caching, just fetch normally
        const url = `/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setBrand(data)
          setLoading(false) // Set false immediately after data loads
        } else {
          setError('Brand not found')
          setLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }

    fetchBrand()
  }, [brandName])

  // Minimal loading - reduce skeleton count from 8 to 3
  if (loading) {
    return (
      <div className="space-y-12">
        {/* Minimal Header Skeleton */}
        <div className="text-center space-y-6">
          <div className="h-12 w-64 mx-auto bg-gray-200 rounded-lg"></div>
        </div>
        
        {/* Minimal Grid Skeleton - only 3 items */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-lg border border-gray-100 aspect-square"></div>
              <div className="mt-6 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-16 max-w-lg mx-auto border border-red-100">
          <div className="text-red-500 mb-8">
            <Package className="h-20 w-20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">Error loading categories</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter out categories that are NULL, empty, or "-"
  const validCategories = (brand?.kategoriProduks || []).filter(
    (cat) => cat.name && cat.name.trim() !== '' && cat.name.trim() !== '-'
  )

  if (!brand || validCategories.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-16 max-w-lg mx-auto border border-gray-200">
          <div className="text-gray-500 mb-8">
            <Package className="h-20 w-20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">No categories available</h3>
            <p className="text-gray-600">This brand doesn&apos;t have any categories yet</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate color palette from brand colorbase
  const colorPalette = generateColorPalette(brand.colorbase || '#03438f')

  return (
    <div className="space-y-16">
      {/* Enhanced Header */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h2 
            className="text-5xl font-bold bg-clip-text text-transparent"
            style={{
              background: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.primaryLight}, ${colorPalette.primaryLighter})`
            }}
          >
            Explore {brand.name} Categories
          </h2>
        </div>
        
        {/* Decorative Line */}
        <div className="flex justify-center">
          <div 
            className="h-1 w-32 rounded-full"
            style={{
              background: `linear-gradient(to right, ${colorPalette.primary}, ${colorPalette.primaryLight}, ${colorPalette.primaryLighter})`
            }}
          ></div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Layers className="h-5 w-5 mr-2" style={{ color: colorPalette.primary }} />
                <span className="font-semibold">{validCategories.length} Categories</span>
              </div>
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2" style={{ color: colorPalette.primaryLight }} />
                <span className="font-semibold">
                  {validCategories.reduce((total, category) => {
                    // Filter out invalid subcategories
                    const validSubcategories = (category.subkategoriProduks || []).filter(
                      (sub) => sub.name && sub.name.trim() !== '' && sub.name.trim() !== '-'
                    )
                    return total + (validSubcategories.reduce((subTotal, subcategory) => {
                      return subTotal + (subcategory.produks?.length || 0)
                    }, 0) || 0)
                  }, 0) || 0} Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 gap-2">
        {validCategories.map((category) => {
          // Filter out invalid subcategories when counting products
          const validSubcategories = (category.subkategoriProduks || []).filter(
            (sub) => sub.name && sub.name.trim() !== '' && sub.name.trim() !== '-'
          )

          const isCurrentCategory = currentCategoryName === category.name

          return (
            <Link key={category.id} href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`}>
              <div className={`group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                isCurrentCategory 
                  ? 'scale-105' 
                  : 'border-gray-100 hover:scale-105'
              }`}
              style={{
                borderColor: isCurrentCategory ? colorPalette.primary : undefined,
                boxShadow: isCurrentCategory ? `0 20px 25px -5px ${colorPalette.bgSecondary}, 0 10px 10px -5px ${colorPalette.bgPrimary}` : undefined
              }}
              onMouseEnter={(e) => {
                if (!isCurrentCategory) {
                  const titleElement = e.currentTarget.querySelector('h3')
                  if (titleElement) {
                    titleElement.style.color = colorPalette.primary
                  }
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrentCategory) {
                  const titleElement = e.currentTarget.querySelector('h3')
                  if (titleElement) {
                    titleElement.style.color = ''
                  }
                }
              }}>
                {/* Image Container with Enhanced Styling */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {category.images && category.images.length > 0 ? (
                    <Image
                      src={category.images[0]}
                      alt={category.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Layers className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(0deg, ${colorPalette.primary}22 0%, transparent 100%)` }}></div>
                  
                  {/* Current Category Badge */}
                  {isCurrentCategory && (
                    <div className="absolute top-4 left-4">
                      <div 
                        className="text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.primaryDark})`
                        }}
                      >
                        <Star className="h-4 w-4 inline mr-1" />
                        Current
                      </div>
                    </div>
                  )}
                  

                  {/* Floating Stats */}
                  {/* <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                      <div className="flex items-center justify-between text-[8px] md:text-xs text-gray-600">
                        <div className="flex items-center">
                          <Package className="md:h-3 h-2 md:w-3 w-2 mr-1" />
                          <span className="font-semibold">{totalProducts} Products</span>
                        </div>
                        <div className="flex items-center">
                          <Layers className="md:h-3 h-2 md:w-3 w-2 mr-1" />
                          <span className="font-semibold">{category.subkategoriProduks?.length || 0} Subcategories</span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Enhanced Content */}
                <div className="p-6">
                  <div className="space-y-4">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${
                      isCurrentCategory 
                        ? '' 
                        : 'text-gray-900'
                    }`}
                    style={{
                      color: isCurrentCategory ? colorPalette.primary : undefined
                    }}>
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <div className="px-6 pb-6">
                  <div 
                    className={`flex items-center justify-center w-full py-3 px-4 rounded-2xl md:text-sm text-[8px] font-semibold transition-all duration-300 ${
                      isCurrentCategory 
                        ? 'text-white shadow-lg' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 group-hover:text-white group-hover:shadow-lg'
                    }`}
                    style={{
                      background: isCurrentCategory 
                        ? `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.primaryDark})`
                        : undefined
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrentCategory) {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${colorPalette.primary}, ${colorPalette.primaryDark})`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentCategory) {
                        e.currentTarget.style.background = ''
                      }
                    }}
                  >
                    <Eye className="md:h-4 h-2 md:w-4 w-2 mr-2" />
                    {isCurrentCategory ? 'Viewing Now' : 'Explore Category'}
                    <ArrowRight className="md:h-4 h-2 md:w-4 w-2 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
