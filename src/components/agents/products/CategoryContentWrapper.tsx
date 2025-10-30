"use client"

import { useEffect, useState } from "react"
import { ModernSubcategoryGrid } from "@/components/agents/products/ModernSubcategoryGrid"
import { ProductListWithDetails } from "@/components/agents/products/ProductListWithDetails"

export function CategoryContentWrapper({ brandName, categoryName }: { brandName: string; categoryName: string }) {
  const [category, setCategory] = useState<any | null>(null)
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

  const subcategories = category.subkategoriProduks || []
  const brandColor = category.brand?.colorbase || null

  // If no subcategories, use products directly under the category.
  const aggregatedProducts = (subcategories.length === 0)
    ? (category.produks || [])
    : subcategories.flatMap((s: any) => s.produks || [])

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-16">
      {subcategories.length > 0 ? (
        <section className="space-y-16">
          <ModernSubcategoryGrid brandName={brandName} categoryName={categoryName} initialCategory={category} />
        </section>
      ) : (
        <ProductListWithDetails brandColor={brandColor} products={aggregatedProducts} />
      )}
    </div>
  )
}


