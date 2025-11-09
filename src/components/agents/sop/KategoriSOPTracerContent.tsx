"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface KategoriSOP {
  id: string
  name: string
}

interface KategoriSOPTracerContentProps {
  kategoriSOP: string
}

export function KategoriSOPTracerContent({ kategoriSOP }: KategoriSOPTracerContentProps) {
  const [kategori, setKategori] = useState<KategoriSOP | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch(`/api/sop/${encodeURIComponent(kategoriSOP.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setKategori(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchKategori()
  }, [kategoriSOP])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!kategori) {
    return <div className="text-center py-12 text-red-500">Category not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/sop/${slugify(kategoriSOP)}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {kategori.name}</h1>
          <p className="text-gray-500 mt-1">View all updates for this SOP category</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        sourceTable="kategori_sops" 
        sourceKey={kategori.id}
        title={`Tracer Updates for ${kategori.name}`}
      />
    </div>
  )
}

