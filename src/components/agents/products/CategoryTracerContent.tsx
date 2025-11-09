"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface KategoriProduk {
  id: string
  name: string
}

interface CategoryTracerContentProps {
  brandName: string
  categoryName: string
}

export function CategoryTracerContent({ brandName, categoryName }: CategoryTracerContentProps) {
  const [category, setCategory] = useState<KategoriProduk | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
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
    fetchCategory()
  }, [brandName, categoryName])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!category) {
    return <div className="text-center py-12 text-red-500">Category not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/products/${slugify(brandName)}/${slugify(categoryName)}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {category.name}</h1>
          <p className="text-gray-500 mt-1">View all updates for this category</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        categoryId={category.id}
        title={`Tracer Updates for ${category.name}`}
      />
    </div>
  )
}

