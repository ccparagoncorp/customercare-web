"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileText, CheckCircle2, ImageIcon, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import sopContent from "@/content/agent/sop.json"
import { TracerButton } from "../TracerButton"

interface DetailSOP {
  id: string
  name: string
  value: string
}

interface JenisSOP {
  id: string
  name: string
  content: string | null
  images: string[]
  detailSOPs: DetailSOP[]
}

interface SOP {
  id: string
  name: string
  description: string | null
  kategoriSOP: {
    id: string
    name: string
  }
  jenisSOPs: JenisSOP[]
}

interface JenisSOPDetailProps {
  kategoriSOP: string
  namaSOP: string
}

export function JenisSOPDetail({ kategoriSOP, namaSOP }: JenisSOPDetailProps) {
  const [sop, setSOP] = useState<SOP | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null)

  useEffect(() => {
    const fetchSOP = async () => {
      try {
        const res = await fetch(
          `/api/sop/${encodeURIComponent(kategoriSOP.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(namaSOP.toLowerCase().replace(/\s+/g, '-'))}`
        )
        if (res.ok) {
          const data = await res.json()
          setSOP(data)
        }
      } catch (error) {
        console.error('Error fetching SOP:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSOP()
  }, [kategoriSOP, namaSOP])

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    // expand first section by default
    if (sop && sop.jenisSOPs.length > 0) {
      setExpandedSections((prev) => ({ [sop.jenisSOPs[0].id]: true, ...prev }))
    }
  }, [sop])

  const copyToClipboard = async (text: string, stepKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStepId(stepKey)
      setTimeout(() => setCopiedStepId(null), 1500)
    } catch {
      // noop
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl w-2/3" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!sop) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{sopContent.sop.notFound}</p>
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
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/agent/sop/${slugify(sop.kategoriSOP.name)}`}
            className="inline-flex items-center text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{sopContent.sop.back} {sop.kategoriSOP.name}</span>
          </Link>
          <TracerButton href={`/agent/sop/${slugify(sop.kategoriSOP.name)}/${slugify(sop.name)}/tracer`} className="text-blue-600 hover:bg-gray-100" />
        </div>
        
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">{sop.name}</h1>
          </div>
          {sop.description && (
            <p className="text-white/90 text-lg leading-relaxed max-w-4xl">{sop.description}</p>
          )}
          {/* Meta chips */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 text-white/90 border border-white/20">
              Kategori: {sop.kategoriSOP.name}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 text-white/90 border border-white/20">
              Jenis: {sop.jenisSOPs.length}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 text-white/90 border border-white/20">
              Total Langkah: {sop.jenisSOPs.reduce((acc, j) => acc + j.detailSOPs.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="space-y-8">
          {sop.jenisSOPs.map((jenis, jenisIndex) => (
            <section
              key={jenis.id}
              id={`jenis-${jenis.id}`}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
            {/* JenisSOP Header */}
            <div className="bg-gradient-to-r from-[#0259b7] via-[#017cff] to-[#398dff] px-8 py-8 relative overflow-hidden">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                        {sopContent.jenis.detailTitle} {jenisIndex + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">{jenis.name}</h2>
                    {jenis.content && (
                      <p className="text-white/90 leading-relaxed">{jenis.content}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSection(jenis.id)}
                    aria-expanded={!!expandedSections[jenis.id]}
                    className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm border border-white/20 transition-colors"
                  >
                    {expandedSections[jenis.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expandedSections[jenis.id] ? "Tutup" : "Buka"}
                  </button>
                </div>
              </div>
            </div>

            {/* Images Section */}
            {expandedSections[jenis.id] && jenis.images.length > 0 && (
              <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-6">
                  <ImageIcon className="w-5 h-5 text-[#0259b7]" />
                  <h3 className="text-lg font-semibold text-gray-900">Galeri</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {jenis.images.map((image, idx) => (
                    <div 
                      key={idx} 
                      className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          window.open(image, '_blank')
                        }
                      }}
                      aria-label={`Buka gambar ${idx + 1} di tab baru`}
                    >
                      <Image
                        src={image}
                        alt={`${jenis.name} - Image ${idx + 1}`}
                        fill
                        className="group-hover:scale-101 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DetailSOPs */}
            {expandedSections[jenis.id] && jenis.detailSOPs.length > 0 && (
              <div className="px-8 py-8 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#0259b7] to-[#017cff] rounded-full" />
                  <h3 className="text-xl font-bold text-gray-900">{sopContent.jenis.detailTitle}</h3>
                </div>
                <div className="grid gap-4">
                  {jenis.detailSOPs.map((detail, detailIndex) => (
                    <div
                      key={detail.id}
                      className="group relative border-l-4 border-[#0259b7] pl-6 pr-4 py-4 bg-gradient-to-r from-gray-50 to-white rounded-r-xl hover:shadow-lg transition-all duration-300 hover:border-[#017cff]"
                    >
                      {/* Number indicator */}
                      <div className="absolute -left-3 top-4 w-6 h-6 bg-[#0259b7] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-white">{detailIndex + 1}</span>
                      </div>
                      
                      <div className="pl-4">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-[#0259b7] transition-colors">
                            {detail.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(detail.value, `${jenis.id}-${detail.id}`)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            aria-label="Copy step"
                          >
                            {copiedStepId === `${jenis.id}-${detail.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedStepId === `${jenis.id}-${detail.id}` ? "Tersalin" : "Salin"}
                          </button>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          ))}
        </div>
      </div>
    </div>
  )
}
