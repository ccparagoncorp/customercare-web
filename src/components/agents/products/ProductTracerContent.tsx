"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Produk {
  id: string
  name: string
}

interface ProductTracerContentProps {
  brandName: string
  categoryName: string
  subcategoryName?: string
  productName: string
}

export function ProductTracerContent({ 
  brandName, 
  categoryName, 
  subcategoryName,
  productName 
}: ProductTracerContentProps) {
  const [product, setProduct] = useState<Produk | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let url = `/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`
        
        if (subcategoryName) {
          url += `/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'))}`
        } else {
          url += `/${encodeURIComponent(productName.toLowerCase().replace(/\s+/g, '-'))}`
        }

        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [brandName, categoryName, subcategoryName, productName])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!product) {
    return <div className="text-center py-12 text-red-500">Product not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')
  
  let backUrl = `/agent/products/${slugify(brandName)}/${slugify(categoryName)}`
  if (subcategoryName) {
    backUrl += `/${slugify(subcategoryName)}`
  }
  backUrl += `/${slugify(productName)}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={backUrl}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {product.name}</h1>
          <p className="text-gray-500 mt-1">View all updates for this product</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        sourceTable="produks" 
        sourceKey={product.id}
        title={`Tracer Updates for ${product.name}`}
      />
    </div>
  )
}

