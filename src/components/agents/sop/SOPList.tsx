"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, ArrowLeft, FileText, ListChecks } from "lucide-react"
import sopContent from "@/content/agent/sop.json"

interface SOP {
  id: string
  name: string
  description: string | null
  jenisSOPs: Array<{
    id: string
    name: string
  }>
}

interface KategoriSOP {
  id: string
  name: string
  description: string | null
  sops: SOP[]
}

interface SOPListProps {
  kategoriSOP: string
}

export function SOPList({ kategoriSOP }: SOPListProps) {
  const [kategori, setKategori] = useState<KategoriSOP | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSOPs = async () => {
      try {
        const res = await fetch(`/api/sop/${encodeURIComponent(kategoriSOP.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setKategori(data)
        }
      } catch (error) {
        console.error('Error fetching SOPs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSOPs()
  }, [kategoriSOP])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!kategori) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{sopContent.kategori.notFound}</p>
        </div>
      </div>
    )
  }

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0259b7] to-[#017cff] rounded-3xl px-8 py-10 shadow-xl">
        {/* Back Button */}
        <Link
          href="/agent/sop"
          className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{sopContent.kategori.back}</span>
        </Link>
        
        {/* Title & Description */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-3">{kategori.name}</h1>
          {kategori.description && (
            <p className="text-white/90 text-lg leading-relaxed max-w-3xl">{kategori.description}</p>
          )}
        </div>
      </div>

      {/* SOP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kategori.sops.map((sop) => (
          <Link
            key={sop.id}
            href={`/agent/sop/${slugify(kategori.name)}/${slugify(sop.name)}`}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-[#0259b7] overflow-hidden transform hover:-translate-y-2"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0259b7]/0 via-[#017cff]/0 to-[#23519c]/0 group-hover:from-[#0259b7]/10 group-hover:via-[#017cff]/10 group-hover:to-[#23519c]/10 transition-all duration-500" />
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0259b7]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#0259b7] to-[#017cff] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0259b7] group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors mb-3 line-clamp-2">
                {sop.name}
              </h3>
              
              {/* Description */}
              {sop.description && (
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {sop.description}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-[#0259b7]/20 transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <ListChecks className="w-4 h-4 text-[#0259b7]" />
                  <span className="font-semibold text-gray-700">{sop.jenisSOPs.length}</span>
                  <span className="text-gray-500">
                    {sop.jenisSOPs.length !== 1 ? sopContent.sop.jenisCount.plural : sopContent.sop.jenisCount.singular}
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
    </div>
  )
}
