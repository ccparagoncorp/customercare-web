"use client"

import { useEffect, useState } from "react"
import { ModernBrandCategories } from "@/components/agents/products/ModernBrandCategories"
import { ProductListWithDetails } from "@/components/agents/products/ProductListWithDetails"
import { apiFetch } from "@/lib/api-client"

type ProductStatus = "NEW" | "REVAMP" | "DISCONTINUE" | "ACTIVE"

interface Product {
  id: string
  name: string
  description: string | null
  status: ProductStatus
  images: string[]
  detailProduks: Array<{
    id: string
    name: string
    detail: string
    images: string[]
  }>
  harga?: string | number | null
}

interface BrandWithNested {
  name: string
  colorbase?: string | null
  produks?: Product[] // Products directly from brand (without category)
  kategoriProduks: Array<{
    name: string
    subkategoriProduks: Array<{
      name: string
      produks: Product[]
    }>
    produks: Product[]
  }>
}

export function BrandContentWrapper({ brandName }: { brandName: string }) {
  const [brand, setBrand] = useState<BrandWithNested | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        // API route already has caching, just fetch normally
        const { data, error } = await apiFetch<BrandWithNested>(
          `/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`
        )
        if (data) {
          setBrand(data)
          setLoading(false) // Set false immediately after data loads
        } else if (error) {
          console.warn('Error fetching brand:', error)
          setLoading(false)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setLoading(false)
      }
    }
    run()
  }, [brandName])

  // Don't block render - show content immediately when ready
  if (!brand) {
    if (loading) {
      // Minimal loading state - just empty space
      return <div className="min-h-[200px]"></div>
    }
    return null
  }

  // Filter out categories that are NULL, empty, or "-"
  const categories = (brand.kategoriProduks || []).filter(
    (cat) => cat.name && cat.name.trim() !== '' && cat.name.trim() !== '-'
  )
  const brandColor = brand.colorbase || null

  // If brand has no valid categories, show products directly from brand
  if (categories.length === 0) {
    // Get products directly from brand (brandId is set, categoryId is null)
    const directProducts = brand.produks || []
    return <ProductListWithDetails brandColor={brandColor} products={directProducts} />
  }

  // If brand has categories, show category grid (don't show direct products)
  // Products will be shown through categories/subcategories

  // Otherwise show categories
  return (
    <section className="space-y-16">
      <ModernBrandCategories brandName={brandName} />
    </section>
  )
}


