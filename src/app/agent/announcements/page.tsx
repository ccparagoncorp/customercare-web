"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Megaphone, Calendar, Clock, RefreshCw, X, User, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Announcement {
  id: string
  judul: string
  deskripsi: string | null
  link: string | null
  image: string[]
  createdBy: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fetchAnnouncements = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await fetch(`/api/announcements?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch announcements')
      }

      const data = await response.json()
      setAnnouncements(data.announcements || [])
      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setError('Failed to load announcements. Please try again.')
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnnouncements(true)
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCardClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setCurrentImageIndex(0)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAnnouncement(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedAnnouncement && selectedAnnouncement.image && selectedAnnouncement.image.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedAnnouncement.image.length)
    }
  }

  const prevImage = () => {
    if (selectedAnnouncement && selectedAnnouncement.image && selectedAnnouncement.image.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedAnnouncement.image.length) % selectedAnnouncement.image.length)
    }
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen mt-12 p-4 md:p-8">
            {/* Header Skeleton */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="h-12 bg-gray-200 rounded-2xl w-1/3 animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-xl w-1/2 animate-pulse"></div>
            </div>

            {/* Cards Skeleton */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen mt-12 p-4 md:p-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-[#0259b7] to-[#017cff] rounded-xl shadow-lg">
                    <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    Announcements
                  </h1>
                </div>
                <p className="text-gray-600 text-base md:text-lg ml-16">
                  Stay updated with the latest news and important updates
                </p>
              </div>
              
              <button
                onClick={() => fetchAnnouncements(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh announcements"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-7xl mx-auto mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            </div>
          )}

          {/* Announcements Grid */}
          {announcements.length === 0 ? (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                    <Megaphone className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Announcements</h3>
                <p className="text-gray-600">There are no announcements at the moment. Check back later!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => handleCardClick(announcement)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0259b7] transform hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image Section */}
                    {announcement.image && announcement.image.length > 0 && (
                      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <Image
                          src={announcement.image[0]}
                          alt={announcement.judul}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0259b7] transition-colors">
                        {announcement.judul}
                      </h3>

                      {/* Description */}
                      {announcement.deskripsi && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {announcement.deskripsi}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">Created:</span>
                            <span>{formatRelativeDate(announcement.createdAt)}</span>
                          </div>
                        </div>
                        
                        {announcement.createdBy && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            <span className="font-medium">By:</span>
                            <span>{announcement.createdBy}</span>
                          </div>
                        )}

                        {announcement.updatedAt !== announcement.createdAt && (
                          <>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Edit className="w-3 h-3" />
                                <span className="font-medium">Updated:</span>
                                <span>{formatRelativeDate(announcement.updatedAt)}</span>
                              </div>
                            </div>
                            
                            {announcement.updatedBy && announcement.updatedBy !== announcement.createdBy && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <User className="w-3 h-3" />
                                <span className="font-medium">By:</span>
                                <span>{announcement.updatedBy}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0259b7]/0 to-[#017cff]/0 group-hover:from-[#0259b7]/5 group-hover:to-[#017cff]/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for Full Announcement Content */}
        {isModalOpen && selectedAnnouncement && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#0259b7] to-[#017cff] px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">{selectedAnnouncement.judul}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Images Carousel */}
                {selectedAnnouncement.image && selectedAnnouncement.image.length > 0 && (
                  <div className="mb-6">
                    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden bg-gray-100 group">
                      {/* Main Image */}
                      <Image
                        src={selectedAnnouncement.image[currentImageIndex]}
                        alt={`${selectedAnnouncement.judul} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 800px"
                        unoptimized
                      />

                      {/* Navigation Arrows - Only show if more than 1 image */}
                      {selectedAnnouncement.image.length > 1 && (
                        <>
                          {/* Previous Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevImage()
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>

                          {/* Next Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextImage()
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {selectedAnnouncement.image.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                          {currentImageIndex + 1} / {selectedAnnouncement.image.length}
                        </div>
                      )}
                    </div>

                    {/* Dots Indicator - Only show if more than 1 image */}
                    {selectedAnnouncement.image.length > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {selectedAnnouncement.image.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => goToImage(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-8 bg-[#0259b7]'
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {selectedAnnouncement.deskripsi && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedAnnouncement.deskripsi}
                    </div>
                  </div>
                )}

                {/* Link */}
                {selectedAnnouncement.link && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <a
                      href={selectedAnnouncement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0259b7] hover:text-[#017cff] font-medium break-all"
                    >
                      {selectedAnnouncement.link}
                    </a>
                  </div>
                )}

                {/* Metadata */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Created At</span>
                      </div>
                      <p className="text-gray-900 ml-6">{formatDate(selectedAnnouncement.createdAt)}</p>
                    </div>

                    {selectedAnnouncement.updatedAt !== selectedAnnouncement.createdAt && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Edit className="w-4 h-4" />
                          <span className="font-semibold">Updated At</span>
                        </div>
                        <p className="text-gray-900 ml-6">{formatDate(selectedAnnouncement.updatedAt)}</p>
                      </div>
                    )}

                    {selectedAnnouncement.createdBy && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">Created By</span>
                        </div>
                        <p className="text-gray-900 ml-6">{selectedAnnouncement.createdBy}</p>
                      </div>
                    )}

                    {selectedAnnouncement.updatedBy && selectedAnnouncement.updatedBy !== selectedAnnouncement.createdBy && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">Updated By</span>
                        </div>
                        <p className="text-gray-900 ml-6">{selectedAnnouncement.updatedBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

