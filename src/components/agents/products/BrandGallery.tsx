"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Images, Eye, Download, Heart } from "lucide-react"

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group">
              <Skeleton className="aspect-square rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !brand) {
    return null // Don't show gallery if there's an error
  }

  // Only show gallery if there are more than 1 images
  if (!brand.images || brand.images.length <= 1) {
    return null
  }

  // Get images from index 1 onwards (skip the first image which is used as logo)
  const galleryImages = brand.images.slice(1)

  if (galleryImages.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Gallery Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          {brand.name} Gallery
        </h2>
        <p className="text-gray-600">
          Explore more images from {brand.name}
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryImages.map((image, index) => (
          <div 
            key={index} 
            className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${brand.name} image ${index + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={selectedImage}
              alt={`${brand.name} gallery image`}
              width={800}
              height={600}
              className="object-contain rounded-2xl shadow-2xl"
            />
            <button 
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
