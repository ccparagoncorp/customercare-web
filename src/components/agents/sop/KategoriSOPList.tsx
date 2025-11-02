"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, FolderOpen, FileText } from "lucide-react"
import sopContent from "@/content/agent/sop.json"

interface KategoriSOP {
  id: string
  name: string
  description: string | null
  sops: Array<{
    id: string
    name: string
  }>
}

export function KategoriSOPList() {
  const [kategoris, setKategoris] = useState<KategoriSOP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKategoris = async () => {
      try {
        const res = await fetch('/api/sop/kategoris')
        if (res.ok) {
          const data = await res.json()
          setKategoris(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchKategoris()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kategoris.map((kategori, index) => (
        <Link
          key={kategori.id}
          href={`/agent/sop/${slugify(kategori.name)}`}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-[#0259b7] overflow-hidden transform hover:-translate-y-2"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0259b7]/0 via-[#017cff]/0 to-[#23519c]/0 group-hover:from-[#0259b7]/10 group-hover:via-[#017cff]/10 group-hover:to-[#23519c]/10 transition-all duration-500" />
          
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0259b7]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-4 flex items-center justify-between">
              <div className="p-3 bg-gradient-to-br from-[#0259b7] to-[#017cff] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0259b7] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors mb-3 line-clamp-2">
              {kategori.name}
            </h3>
            
            {/* Description */}
            {kategori.description && (
              <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                {kategori.description}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-[#0259b7]/20 transition-colors">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-[#0259b7]" />
                <span className="font-semibold text-gray-700">{kategori.sops.length}</span>
                <span className="text-gray-500">
                  {kategori.sops.length !== 1 ? sopContent.kategori.sopCount.plural : sopContent.kategori.sopCount.singular}
                </span>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-[#0259b7]/10 to-[#017cff]/10 rounded-full">
                <span className="text-xs font-medium text-[#0259b7]">View</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
