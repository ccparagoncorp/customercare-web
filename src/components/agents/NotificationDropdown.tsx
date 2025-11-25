"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, X, Check, Clock, Megaphone } from "lucide-react"
import { useRouter } from "next/navigation"
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

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onNotificationsRead?: () => void
}

export function NotificationDropdown({ isOpen, onClose, onNotificationsRead }: NotificationDropdownProps) {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const readIdsRef = useRef<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Sync ref with state
  useEffect(() => {
    readIdsRef.current = readIds
  }, [readIds])

  // Fetch announcements - no blocking loading
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcements?limit=50&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        const announcementsData = data.announcements || []
        
        // Get read announcement IDs from localStorage
        const readIdsFromStorage = JSON.parse(localStorage.getItem('readAnnouncements') || '[]') as string[]
        setReadIds(new Set(readIdsFromStorage))
        
        setAnnouncements(announcementsData)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setLoading(false)
    }
  }

  // Mark announcements as read
  const markAsRead = async (announcementIds: string[]): Promise<void> => {
    try {
      // Get current read IDs from localStorage
      const currentReadIds = JSON.parse(localStorage.getItem('readAnnouncements') || '[]') as string[]
      
      // Add new read IDs
      const newReadIds = [...new Set([...currentReadIds, ...announcementIds])]
      
      // Save to localStorage
      localStorage.setItem('readAnnouncements', JSON.stringify(newReadIds))
      
      // Update local state
      const newReadIdsSet = new Set(newReadIds)
      setReadIds(newReadIdsSet)

      // Notify parent component (Header) to refresh unread count
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('announcements-updated'))
        
        if (onNotificationsRead) {
          onNotificationsRead()
        }
      }, 150)
    } catch (error) {
      console.error('Error marking announcements as read:', error)
    }
  }

  const handleAnnouncementClick = (announcementId: string) => {
    // Mark as read
    if (!readIds.has(announcementId)) {
      markAsRead([announcementId])
    }
    // Navigate to announcements page
    router.push('/agent/announcements')
    onClose()
  }

  // Use Intersection Observer to mark announcements as read when they come into view
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current || announcements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIds: string[] = []
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const announcementId = entry.target.getAttribute('data-announcement-id')
            if (announcementId) {
              // Check if not already marked as read using ref
              if (!readIdsRef.current.has(announcementId)) {
                visibleIds.push(announcementId)
              }
            }
          }
        })

        // Mark visible announcements as read (batch every 3 items)
        if (visibleIds.length > 0) {
          const idsToMark = visibleIds.slice(0, 3)
          markAsRead(idsToMark)
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '0px',
        threshold: 0.5, // Mark as read when 50% visible
      }
    )

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (scrollContainerRef.current) {
        const announcementElements = scrollContainerRef.current.querySelectorAll('[data-announcement-id]')
        announcementElements.forEach((el) => observer.observe(el))
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, announcements.length])

  // Handle scroll to mark all as read when scrolled to bottom
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Mark all as read when scrolled to bottom
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const unreadIds = announcements
        .filter(announcement => !readIds.has(announcement.id))
        .map(announcement => announcement.id)
      
      if (unreadIds.length > 0) {
        markAsRead(unreadIds)
      }
    }
  }

  // Fetch announcements when dropdown opens
  useEffect(() => {
    if (isOpen) {
      if (announcements.length === 0) {
        setLoading(true)
      }
      fetchAnnouncements()
      // Set up polling to refresh announcements every 30 seconds
      const interval = setInterval(fetchAnnouncements, 30000)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, announcements.length])

  // Format date
  const formatDate = (dateString: string) => {
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
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute right-4 top-14 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[600px] flex flex-col z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#03438f]" />
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Announcements List */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03438f] mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No announcements</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {announcements.map((announcement) => {
                const isRead = readIds.has(announcement.id)
                return (
                  <button
                    key={announcement.id}
                    data-announcement-id={announcement.id}
                    onClick={() => handleAnnouncementClick(announcement.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      !isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Image or Icon */}
                      <div className="flex-shrink-0">
                        {announcement.image && announcement.image.length > 0 ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={announcement.image[0]}
                              alt={announcement.judul}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0259b7] to-[#017cff] flex items-center justify-center">
                            <Megaphone className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold line-clamp-2 ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {announcement.judul}
                          </p>
                          {!isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                        {announcement.deskripsi && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {announcement.deskripsi}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {announcement.createdBy && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {announcement.createdBy}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(announcement.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {announcements.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={async () => {
                // Get all announcement IDs that are currently unread
                const allUnreadIds = announcements
                  .filter(announcement => !readIds.has(announcement.id))
                  .map(announcement => announcement.id)
                
                if (allUnreadIds.length > 0) {
                  // Get current read IDs from localStorage
                  const currentReadIds = JSON.parse(localStorage.getItem('readAnnouncements') || '[]') as string[]
                  
                  // Combine with new read IDs
                  const newReadIds = [...new Set([...currentReadIds, ...allUnreadIds])]
                  
                  // Update localStorage
                  localStorage.setItem('readAnnouncements', JSON.stringify(newReadIds))
                  
                  // Update local state immediately
                  const newReadIdsSet = new Set(newReadIds)
                  setReadIds(newReadIdsSet)
                  
                  // Call markAsRead
                  await markAsRead(allUnreadIds)
                  
                  // Force refresh of Header unread count
                  setTimeout(() => {
                    if (onNotificationsRead) {
                      onNotificationsRead()
                    }
                    window.dispatchEvent(new CustomEvent('announcements-updated'))
                  }, 500)
                }
              }}
              className="w-full text-sm text-[#03438f] hover:text-[#012f65] font-medium flex items-center justify-center gap-2 py-2"
            >
              <Check className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


