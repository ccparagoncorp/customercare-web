"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package } from "lucide-react"

interface Brand {
  id: string
  name: string
  images: string[]
}

interface BrandGalleryProps {
  brandName: string
}

export function BrandGallery({ brandName }: BrandGalleryProps) {
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
      <div className="space-y-8">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return null
  }

  // Filter images dengan index > 1 (skip index 0 dan 1)
  const additionalImages = brand.images && brand.images.length > 1 
    ? brand.images.slice(1) 
    : []

  // Jika tidak ada gambar tambahan, tidak render komponen
  if (additionalImages.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          {brand.name} Gallery
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore additional images and visuals from {brand.name}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="flex flex-col gap-4">
        {additionalImages.map((image, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300">
            <div className="relative w-full">
              <Image
                src={image}
                alt={`${brand.name} gallery image ${index + 3}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-300"
                priority={index < 3} // Prioritize first 3 images
              />
              
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}