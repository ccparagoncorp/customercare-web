"use client"

import { useEffect, useState } from "react"
import { generateColorPalette } from "@/lib/colorUtils"

interface Brand {
  id: string
  name: string
  description: string | null
  images: string[]
  colorbase: string | null
}

interface BrandDescriptionSectionProps {
  brandName: string
}

export function BrandDescriptionSection({ brandName }: BrandDescriptionSectionProps) {
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

  if (loading || !brand || !brand.description) return null

  const palette = generateColorPalette(brand.colorbase || '#03438f')

  return (
    <section className="max-w-5xl mx-auto px-6">
      <div
        className="rounded-3xl p-8 md:p-10 shadow-sm border"
        style={{
          background: `linear-gradient(180deg, ${palette.primaryLighter}10 0%, #ffffff 40%)`,
          borderColor: `${palette.primary}22`
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{ color: palette.primary }}
        >
          Tentang {brand.name}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {brand.description}
        </p>
      </div>
    </section>
  )
}


