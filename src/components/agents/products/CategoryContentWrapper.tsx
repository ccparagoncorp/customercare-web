"use client"

import { useEffect, useState } from "react"
import { ModernSubcategoryGrid } from "@/components/agents/products/ModernSubcategoryGrid"
import { ProductListWithDetails } from "@/components/agents/products/ProductListWithDetails"

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

interface Subcategory {
  id: string
  name: string
  description: string | null
  images: string[]
  produks: Product[]
}

interface Category {
  id: string
  name: string
  description: string | null
  subkategoriProduks: Subcategory[]
  produks: Product[]
  brand?: {
    colorbase: string | null
  }
}

export function CategoryContentWrapper({ brandName, categoryName }: { brandName: string; categoryName: string }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setCategory(data)
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [brandName, categoryName])

  if (loading || !category) return null

  // Filter out subcategories that are NULL, empty, or "-"
  const validSubcategories = (category.subkategoriProduks || []).filter(
    (sub) => sub.name && sub.name.trim() !== '' && sub.name.trim() !== '-'
  )
  const brandColor = category.brand?.colorbase || null

  // If no valid subcategories, show products directly from category
  if (validSubcategories.length === 0) {
    // Get products directly from category (categoryId is set, subkategoriProdukId is null)
    const directProducts = category.produks || []
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-16">
        <ProductListWithDetails brandColor={brandColor} products={directProducts} />
      </div>
    )
  }

  // Otherwise show subcategories
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-16">
      <section className="space-y-16">
        <ModernSubcategoryGrid brandName={brandName} categoryName={categoryName} initialCategory={category} />
      </section>
    </div>
  )
}


