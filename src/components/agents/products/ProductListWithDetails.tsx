"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Filter, Search, SortAsc } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"
import { formatCurrency } from "@/lib/utils"

type ProductStatus = "NEW" | "REVAMP" | "DISCONTINUE" | "ACTIVE"

interface DetailProduk {
  id: string
  name: string
  detail: string
  images: string[]
}

interface Produk {
  id: string
  name: string
  description: string | null
  status: ProductStatus
  images: string[]
  detailProduks: DetailProduk[]
  harga?: string | number | null
}

interface BrandLite {
  colorbase: string | null
}

interface ProductListWithDetailsProps {
  brandColor?: string | null
  products: Produk[]
}

export function ProductListWithDetails({ brandColor = "#03438f", products }: ProductListWithDetailsProps) {
  const palette = generateColorPalette(brandColor || "#03438f")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name-asc")
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    let list = products || []
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    if (status !== "all") {
      list = list.filter(p => p.status === status)
    }
    switch (sortBy) {
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name))
        break
      case "status":
        list = [...list].sort((a, b) => a.status.localeCompare(b.status))
        break
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [products, query, status, sortBy])

  const toggleOpen = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

  return (
    <section className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-2xl border px-4 py-3 pl-11 focus:outline-none focus:ring-2"
            style={{
              borderColor: `${palette.primary}33`,
              boxShadow: `0 0 0 0 rgba(0,0,0,0)`
            }}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border px-3 py-3"
            style={{ borderColor: `${palette.primary}33` }}
          >
            <option value="all">Semua status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NEW">NEW</option>
            <option value="REVAMP">REVAMP</option>
            <option value="DISCONTINUE">DISCONTINUE</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border px-3 py-3"
            style={{ borderColor: `${palette.primary}33` }}
          >
            <option value="name-asc">Sort: Nama A→Z</option>
            <option value="name-desc">Sort: Nama Z→A</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            style={{ borderColor: `${palette.primary}22`, backgroundImage: `linear-gradient(180deg, ${palette.primaryLighter}08 0%, #ffffff 40%)` }}
          >
            <div className="flex gap-5 p-5 md:p-6">
              <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border"
                   style={{ borderColor: `${palette.primary}22` }}>
                {p.images && p.images.length > 0 ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-3" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-300">No Image</div>
                )}
                {/* Status badge on image top-right */}
                <span className="absolute top-2 right-2 text-[11px] md:text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm"
                      style={{ background: `${palette.primary}12`, color: palette.primary, borderColor: `${palette.primary}33` }}>
                  {p.status}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold truncate" style={{ color: palette.primary }}>{p.name}</h3>
                    {p.description && (
                      <p className="text-sm md:text-base text-gray-600 mt-2 whitespace-pre-line">{p.description}</p>
                    )}
                  </div>
                </div>
                {/* Price from p.harga if available */}
                {p.harga !== undefined && p.harga !== null && (
                  <div className="mt-3">
                    <span
                      className="inline-flex items-center gap-2 text-base md:text-lg font-semibold px-3 py-1.5 rounded-full border"
                      style={{ color: palette.primary, borderColor: `${palette.primary}33`, background: `${palette.primary}0D` }}
                    >
                      {formatCurrency(p.harga)}
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => toggleOpen(p.id)}
                    className="text-sm md:text-base font-semibold flex items-center gap-1"
                    style={{ color: palette.primary }}
                  >
                    Detail produk {openIds.has(p.id) ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                  </button>
                </div>
              </div>
            </div>

            {openIds.has(p.id) && (
              <div className="px-5 md:px-6 pb-6">
                <div className="rounded-2xl border p-5" style={{ borderColor: `${palette.primary}22` }}>
                  {p.detailProduks && p.detailProduks.length > 0 ? (
                    <div className="space-y-3">
                      {p.detailProduks.map(d => (
                        <details key={d.id} className="group rounded-xl border px-4 py-3" style={{ borderColor: `${palette.primary}22` }}>
                          <summary className="cursor-pointer list-none flex items-center justify-between">
                            <span className="font-semibold" style={{ color: palette.primary }}>{d.name}</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{d.detail}</div>
                        </details>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Tidak ada detail produk.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

