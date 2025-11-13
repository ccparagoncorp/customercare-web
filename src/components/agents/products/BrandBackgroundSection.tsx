"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package, History } from "lucide-react"
import { generateColorPalette } from "@/lib/colorUtils"
import Link from "next/link"

interface Brand {
  id: string
  name: string
  description: string | null
  images: string[]
  link_sampul: string | null
  colorbase: string | null
}

interface BrandBackgroundSectionProps {
  brandName: string
}

export function BrandBackgroundSection({ brandName }: BrandBackgroundSectionProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brands/by-name/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}`)
        if (response.ok) {
          const data = await response.json()
          setBrand(data)
        } else {
          setError('Brand not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBrand()
  }, [brandName])

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

  if (error || !brand) {
    return (
      <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-red-500 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-end">
          <div className="flex items-center justify-between mb-8">
            <Link href="/agent/products" className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Products</span>
            </Link>
          </div>
          <div className="text-white">
            <Package className="h-16 w-16 mb-4 opacity-80" />
            <h1 className="text-4xl font-bold mb-2">Brand Not Found</h1>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Generate color palette from brand colorbase
  const colorPalette = generateColorPalette(brand.colorbase || '#03438f')
  
  // Prefer YouTube cover link if available
  const youtubeUrl = brand.link_sampul || null
  // Fallback background image from second index (index 1)
  const backgroundImage = brand.images && brand.images.length > 1 ? brand.images[1] : null

  // Extract YouTube video ID (supports youtu.be and youtube.com URLs)
  const getYouTubeId = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname === 'youtu.be') {
        return u.pathname.slice(1)
      }
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

  return (
    <div className="relative md:h-[500px] h-[200px] w-full overflow-hidden">
      {/* Background Media */}
      {youtubeId ? (
        <div className="absolute inset-0 overflow-hidden">
          {/* Technique to cover: oversized iframe centered */}
          <iframe
            title={`${brand.name} cover video`}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&modestbranding=1&rel=0&start=0&end=10&enablejsapi=1&playlist=${youtubeId}`}
            allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
            style={{
              aspectRatio: '16 / 9',
              height: 'auto',
              pointerEvents: 'none',
              border: '0'
            }}
          />
        </div>
      ) : backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={`${brand.name} background`}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.primaryDark} 100%)`
          }}
        ></div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(0deg, ${colorPalette.primary}88 0%, ${colorPalette.primary}00 100%)`
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          {/* Back Button - Top Left */}
          <Link href="/agent/products" className="flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium hidden sm:inline">Back to Products</span>
            <span className="text-sm font-medium sm:hidden">Back</span>
          </Link>
          
          {/* Tracer Button - Top Right */}
          <Link 
            href={`/agent/products/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}/tracer`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: `${colorPalette.primary}DD`,
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colorPalette.primaryDark}DD`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${colorPalette.primary}DD`
            }}
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Tracer Updates</span>
          </Link>
        </div>
        
        {/* Brand Name - Bottom Left */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {brand.name}
          </h1>
        </div>
      </div>
    </div>
  )
}
