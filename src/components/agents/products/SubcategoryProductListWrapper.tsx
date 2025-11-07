"use client"

import { useEffect, useState } from "react"
import { ProductListWithDetails } from "@/components/agents/products/ProductListWithDetails"

interface Product {
  id: string
  name: string
  description: string | null
  status: string
  images: string[]
  detailProduks: Array<{
    id: string
    name: string
    detail: string
    images: string[]
  }>
  harga?: string | number | null
}

export function SubcategoryProductListWrapper({ brandName, categoryName, subcategoryName }: { brandName: string; categoryName: string; subcategoryName: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [brandColor, setBrandColor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const subRes = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (subRes.ok) {
          const data = await subRes.json()
          setProducts(data.produks || [])
          setBrandColor(data.kategoriProduk?.brand?.colorbase || null)
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [brandName, categoryName, subcategoryName])

  if (loading) return null

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-16">
      <ProductListWithDetails brandColor={brandColor} products={products} />
    </div>
  )
}


