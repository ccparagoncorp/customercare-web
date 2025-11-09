"use client"

import { useEffect, useState } from "react"
import { TracerUpdateDisplay } from "../TracerUpdateDisplay"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface SOP {
  id: string
  name: string
}

interface SOPTracerContentProps {
  kategoriSOP: string
  namaSOP: string
}

export function SOPTracerContent({ kategoriSOP, namaSOP }: SOPTracerContentProps) {
  const [sop, setSOP] = useState<SOP | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSOP = async () => {
      try {
        const res = await fetch(`/api/sop/${encodeURIComponent(kategoriSOP.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(namaSOP.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setSOP(data)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSOP()
  }, [kategoriSOP, namaSOP])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!sop) {
    return <div className="text-center py-12 text-red-500">SOP not found</div>
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/agent/sop/${slugify(kategoriSOP)}/${slugify(namaSOP)}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tracer Updates - {sop.name}</h1>
          <p className="text-gray-500 mt-1">View all updates for this SOP</p>
        </div>
      </div>

      <TracerUpdateDisplay 
        sourceTable="sops" 
        sourceKey={sop.id}
        title={`Tracer Updates for ${sop.name}`}
      />
    </div>
  )
}

