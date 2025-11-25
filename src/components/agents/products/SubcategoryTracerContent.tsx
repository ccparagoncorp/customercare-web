"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface SubkategoriProduk {
  id: string
  name: string
}

interface SubcategoryTracerContentProps {
  brandName: string
  categoryName: string
  subcategoryName: string
}

export function SubcategoryTracerContent({ 
  brandName, 
  categoryName, 
  subcategoryName 
}: SubcategoryTracerContentProps) {
  const [subcategory, setSubcategory] = useState<SubkategoriProduk | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const res = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setSubcategory(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSubcategory()
  }, [brandName, categoryName, subcategoryName])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!subcategory) {
    return <div className="text-center py-12 text-red-500">Subcategory not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-6">
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
        subcategoryId={subcategory.id}
        title={`Tracer Updates for ${subcategory.name}`}
      />
    </div>
  )
}

