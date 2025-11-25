"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Brand {
  id: string
  name: string
}

interface BrandTracerContentProps {
  brandName: string
}

export function BrandTracerContent({ brandName }: BrandTracerContentProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrand = async () => {
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
    fetchBrand()
  }, [brandName])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!brand) {
    return <div className="text-center py-12 text-red-500">Brand not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-4 mt-3">
      <div className="flex gap-4">
        <Link
          href={`/agent/products/${slugify(brandName)}`}
          className="p-2 flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Back</span>
        </Link>
      </div>

        <TracerUpdateDisplay 
          brandId={brand.id}
          title={`Tracer Updates for ${brand.name}`}
          />
    </div>
  )
}

