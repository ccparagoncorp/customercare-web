"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"

interface BrandLite {
  name: string
  colorbase: string | null
  link_sampul: string | null
}

interface CategoryLite {
  name: string
  brand: BrandLite
}

interface Subcategory {
  id: string
  name: string
  description: string | null
  images: string[]
  kategoriProduk: CategoryLite
}

export function SubcategoryBackgroundSection({ brandName, categoryName, subcategoryName }: { brandName: string; categoryName: string; subcategoryName: string }) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/brands/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(subcategoryName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (res.ok) {
          const data = await res.json()
          setSubcategory(data)
        } else {
          setError('Subcategory not found')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [brandName, categoryName, subcategoryName])

  if (loading) {
    return (
      <div className="relative h-96 w-full overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-40 bg-white/20" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-80 bg-white/20" />
            <Skeleton className="h-6 w-96 bg-white/20" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !subcategory) {
    return (
      <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-red-500 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-8">
            <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to {categoryName}</span>
            </Link>
          </div>
          <div className="text-white">
            <Package className="h-16 w-16 mb-4 opacity-80" />
            <h1 className="text-4xl font-bold mb-2">Subcategory Not Found</h1>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const colorPalette = generateColorPalette(subcategory.kategoriProduk.brand?.colorbase || '#03438f')

  // Prefer brand YouTube cover if available; fallback to subcategory second image; then gradient
  const youtubeUrl = subcategory.kategoriProduk.brand?.link_sampul || null
  const getYouTubeId = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname === 'youtu.be') return u.pathname.slice(1)
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v')
        if (v) return v
        const paths = u.pathname.split('/')
        const idx = paths.indexOf('embed')
        if (idx >= 0 && paths[idx + 1]) return paths[idx + 1]
      }
    } catch {}
    return null
  }
  const youtubeId = youtubeUrl ? getYouTubeId(youtubeUrl) : null
  const backgroundImage = subcategory.images && subcategory.images.length > 1 ? subcategory.images[1] : null

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Media to match CategoryBackgroundSection */}
      {youtubeId ? (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            title={`${subcategory.name} cover video`}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&modestbranding=1&rel=0&start=0&end=10&enablejsapi=1&playlist=${youtubeId}`}
            allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
            style={{ aspectRatio: '16 / 9', height: 'auto', pointerEvents: 'none', border: '0' }}
          />
        </div>
      ) : backgroundImage ? (
        <Image src={backgroundImage} alt={`${subcategory.name} background`} fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.primaryDark} 100%)` }}></div>
      )}

      {/* Overlay matches category/brand section */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(0deg, ${colorPalette.primary}88 0%, ${colorPalette.primary}00 100%)` }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`} className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back to {categoryName}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{subcategory.name}</h1>
        </div>
      </div>
    </div>
  )
}


