"use client"

import { useEffect, useState } from "react"
import { generateColorPalette } from "@/lib/colorUtils"

interface CategoryDescriptionSectionProps {
  brandName: string
  categoryName: string
}

export function CategoryDescriptionSection({ brandName, categoryName }: CategoryDescriptionSectionProps) {
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

  if (loading || !category || !category.description) return null

  const palette = generateColorPalette(category.brand?.colorbase || '#03438f')

  return (
    <section className="max-w-5xl mx-auto px-6 mt-8">
      <div
        className="rounded-3xl p-8 md:p-10 shadow-sm border"
        style={{
          background: `linear-gradient(180deg, ${palette.primaryLighter}10 0%, #ffffff 40%)`,
          borderColor: `${palette.primary}22`
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: palette.primary }}>
          Tentang {category.name}
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{category.description}</p>
      </div>
    </section>
  )
}


