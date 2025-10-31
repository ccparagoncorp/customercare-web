"use client"

import { useEffect, useState } from "react"
import { ModernBrandCategories } from "@/components/agents/products/ModernBrandCategories"
import { ProductListWithDetails } from "@/components/agents/products/ProductListWithDetails"

interface BrandWithNested {
  name: string
  colorbase?: string | null
  kategoriProduks: Array<{
    name: string
    subkategoriProduks: Array<{
      name: string
      produks: any[]
    }>
    produks: any[]
  }>
}

export function BrandContentWrapper({ brandName }: { brandName: string }) {
  const [brand, setBrand] = useState<BrandWithNested | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setBrand(data)
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [brandName])

  if (loading || !brand) return null

  const categories = brand.kategoriProduks || []
  const brandColor = brand.colorbase || null

  // If brand has no categories, show product list (aggregated across subcategories and direct category products if any existed)
  const aggregatedProducts = categories.flatMap((c) => {
    const fromSub = (c.subkategoriProduks || []).flatMap((s) => s.produks || [])
    const fromCat = c.produks || []
    return [...fromCat, ...fromSub]
  })

  return categories.length > 0 ? (
    <section className="space-y-16">
      <ModernBrandCategories brandName={brandName} />
    </section>
  ) : (
    <ProductListWithDetails brandColor={brandColor} products={aggregatedProducts} />
  )
}


