"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, X, Check, Clock } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  sourceTable: string
  sourceKey: string
  recordName: string | null // Name of the record for link generation
  parentInfo: { brandName?: string; categoryName?: string; subcategoryName?: string; kategoriSOP?: string } | null // Parent info for link generation
  fieldName: string
  changedBy: string | null
  changedAt: string
  isRead: boolean
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onNotificationsRead?: () => void
}

export function NotificationDropdown({ isOpen, onClose, onNotificationsRead }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const readIdsRef = useRef<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Sync ref with state
  useEffect(() => {
    readIdsRef.current = readIds
  }, [readIds])

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications?limit=50')
      if (response.ok) {
        const data = await response.json()
        const notifications = data.notifications || []
        
        // Get read notification IDs from localStorage for visual indication only
        const readIdsFromStorage = JSON.parse(localStorage.getItem('readNotifications') || '[]') as string[]
        setReadIds(new Set(readIdsFromStorage))
        
        // Mark notifications as read if they're in localStorage (for visual only)
        const notificationsWithReadStatus = notifications.map((notif: Notification) => ({
          ...notif,
          isRead: readIdsFromStorage.includes(notif.id),
        }))
        
        setNotifications(notificationsWithReadStatus)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notifications as read
  const markAsRead = async (notificationIds: string[]): Promise<void> => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      })

      if (response.ok) {
        // Get current read IDs from localStorage
        const currentReadIds = JSON.parse(localStorage.getItem('readNotifications') || '[]') as string[]
        
        // Add new read IDs
        const newReadIds = [...new Set([...currentReadIds, ...notificationIds])]
        
        // Save to localStorage FIRST
        localStorage.setItem('readNotifications', JSON.stringify(newReadIds))
        
        // Update local state
        const newReadIdsSet = new Set(newReadIds)
        setReadIds(newReadIdsSet)
        
        // Update notifications to mark as read
        setNotifications(prev => 
          prev.map(notif => 
            notificationIds.includes(notif.id) 
              ? { ...notif, isRead: true }
              : notif
          )
        )

        // Notify parent component (Header) to refresh unread count
        // Use setTimeout to ensure localStorage is written and state is updated
        setTimeout(() => {
          // Dispatch event first
          window.dispatchEvent(new CustomEvent('notifications-updated'))
          
          // Then call callback
          if (onNotificationsRead) {
            onNotificationsRead()
          }
        }, 150)
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  // Use Intersection Observer to mark notifications as read when they come into view
  useEffect(() => {
    if (!isOpen || !scrollContainerRef.current || notifications.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleIds: string[] = []
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notificationId = entry.target.getAttribute('data-notification-id')
            if (notificationId) {
              // Check if not already marked as read using ref
              if (!readIdsRef.current.has(notificationId)) {
                // Check if notification exists and is unread
                const notification = notifications.find(n => n.id === notificationId)
                if (notification && !notification.isRead) {
                  visibleIds.push(notificationId)
                }
              }
            }
          }
        })

        // Mark visible notifications as read (batch every 3 items)
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
        const notificationElements = scrollContainerRef.current.querySelectorAll('[data-notification-id]')
        notificationElements.forEach((el) => observer.observe(el))
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, notifications.length]) // Only depend on length to avoid re-creating observer too often

  // Handle scroll to mark all as read when scrolled to bottom
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Mark all as read when scrolled to bottom
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const unreadIds = notifications
        .filter(notif => !readIds.has(notif.id) && !notif.isRead)
        .map(notif => notif.id)
      
      if (unreadIds.length > 0) {
        markAsRead(unreadIds)
      }
    }
  }

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
      // Set up polling to refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

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

  // Get action type color
  const getActionTypeColor = (actionType: string) => {
    switch (actionType.toUpperCase()) {
      case 'INSERT':
      case 'CREATE':
        return 'bg-green-100 text-green-800'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper function to slugify text for URL
  const slugify = (text: string | null): string => {
    if (!text) return ''
    return text.toLowerCase().trim().replace(/\s+/g, '-')
  }

  // Get notification link based on source table
  const getNotificationLink = (notification: Notification): string => {
    const sourceTable = notification.sourceTable
    const recordName = notification.recordName
    const parentInfo = notification.parentInfo

    // If we don't have record name, return general tracer page for the module
    if (!recordName) {
      if (sourceTable === 'brands' || sourceTable.startsWith('kategori_produks') || sourceTable.startsWith('subkategori_produks') || sourceTable.startsWith('produks') || sourceTable.startsWith('detail_produks')) {
        return '/agent/products/tracer' // General products tracer page
      } else if (sourceTable.startsWith('sops') || sourceTable.startsWith('kategori_sops') || sourceTable.startsWith('jenis_sops') || sourceTable.startsWith('detail_sops')) {
        return '/agent/sop/tracer' // General SOP tracer page
      } else if (sourceTable.startsWith('knowledges') || sourceTable.startsWith('detail_knowledges') || sourceTable.startsWith('jenis_detail_knowledges') || sourceTable.startsWith('produk_jenis_detail_knowledges')) {
        return '/agent/knowledge/tracer' // General knowledge tracer page
      } else if (sourceTable.startsWith('quality_trainings') || sourceTable.startsWith('jenis_quality_trainings') || sourceTable.startsWith('detail_quality_trainings') || sourceTable.startsWith('subdetail_quality_trainings')) {
        return '/agent/quality-training/tracer' // General quality training tracer page
      }
      return '#'
    }

    const slug = slugify(recordName)

    // Map source tables to their respective tracer routes
    // Always return the tracer page path
    switch (sourceTable) {
      case 'brands':
        return `/agent/products/${slug}/tracer`
      
      case 'kategori_produks': {
        // For category, we need brand name
        if (parentInfo?.brandName) {
          const brandSlug = slugify(parentInfo.brandName)
          return `/agent/products/${brandSlug}/${slug}/tracer`
        }
        // If no brand name but we have recordName, try to use it anyway
        return `/agent/products/${slug}/tracer`
      }
      
      case 'subkategori_produks': {
        // For subcategory, we need brand and category names
        if (parentInfo?.brandName && parentInfo?.categoryName) {
          const brandSlug = slugify(parentInfo.brandName)
          const categorySlug = slugify(parentInfo.categoryName)
          return `/agent/products/${brandSlug}/${categorySlug}/${slug}/tracer`
        }
        // If no parent info, we can't create proper link
        // But at least try to use the subcategory name
        if (parentInfo?.categoryName) {
          const categorySlug = slugify(parentInfo.categoryName)
          return `/agent/products/${categorySlug}/${slug}/tracer`
        }
        // Last resort: use subcategory name only
        return `/agent/products/${slug}/tracer`
      }
      
      case 'produks':
      case 'detail_produks': {
        // For products, link to parent (subcategory/category/brand) tracer page
        // Don't include product name in path since there's no /[productName] page
        if (parentInfo?.brandName && parentInfo?.categoryName) {
          const brandSlug = slugify(parentInfo.brandName)
          const categorySlug = slugify(parentInfo.categoryName)
          if (parentInfo.subcategoryName) {
            // Product with subcategory: /brand/category/subcategory/tracer
            const subcategorySlug = slugify(parentInfo.subcategoryName)
            return `/agent/products/${brandSlug}/${categorySlug}/${subcategorySlug}/tracer`
          } else {
            // Product with category only: /brand/category/tracer
            return `/agent/products/${brandSlug}/${categorySlug}/tracer`
          }
        }
        // If only brand info available
        if (parentInfo?.brandName) {
          const brandSlug = slugify(parentInfo.brandName)
          return `/agent/products/${brandSlug}/tracer`
        }
        // Last resort: general products tracer page
        return '/agent/products/tracer'
      }
      
      case 'knowledges':
      case 'detail_knowledges':
      case 'jenis_detail_knowledges':
      case 'produk_jenis_detail_knowledges':
        return `/agent/knowledge/${slug}/tracer`
      
      case 'kategori_sops':
        return `/agent/sop/${slug}/tracer`
      
      case 'sops':
      case 'jenis_sops':
      case 'detail_sops': {
        // For SOP, we need kategoriSOP name
        if (parentInfo?.kategoriSOP) {
          const kategoriSlug = slugify(parentInfo.kategoriSOP)
          return `/agent/sop/${kategoriSlug}/${slug}/tracer`
        }
        // If no kategoriSOP, return general SOP tracer page
        return '/agent/sop/tracer'
      }
      
      case 'quality_trainings':
      case 'jenis_quality_trainings':
      case 'detail_quality_trainings':
      case 'subdetail_quality_trainings':
        return `/agent/quality-training/${slug}/tracer`
      
      default:
        return '#'
    }
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
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03438f] mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const isRead = readIds.has(notification.id) || notification.isRead
                return (
                  <Link
                    key={notification.id}
                    data-notification-id={notification.id}
                    href={getNotificationLink(notification)}
                    onClick={() => {
                      if (!isRead) {
                        markAsRead([notification.id])
                      }
                    }}
                    className={`block p-4 hover:bg-gray-50 transition-colors ${
                      !isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Action Type Badge */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActionTypeColor(notification.type)}`}>
                        <span className="text-xs font-bold">
                          {notification.type.charAt(0)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          {!isRead && (
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {notification.changedBy && (
                            <span>By {notification.changedBy}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(notification.changedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={async () => {
                // Get all notification IDs that are currently unread
                const allUnreadIds = notifications
                  .filter(notif => {
                    const isRead = readIds.has(notif.id) || notif.isRead
                    return !isRead
                  })
                  .map(notif => notif.id)
                
                if (allUnreadIds.length > 0) {
                  // Get current read IDs from localStorage
                  const currentReadIds = JSON.parse(localStorage.getItem('readNotifications') || '[]') as string[]
                  
                  // Combine with new read IDs
                  const newReadIds = [...new Set([...currentReadIds, ...allUnreadIds])]
                  
                  // Update localStorage FIRST (before calling markAsRead)
                  localStorage.setItem('readNotifications', JSON.stringify(newReadIds))
                  
                  // Update local state immediately
                  const newReadIdsSet = new Set(newReadIds)
                  setReadIds(newReadIdsSet)
                  
                  // Update notifications state
                  setNotifications(prev => 
                    prev.map(notif => 
                      allUnreadIds.includes(notif.id) 
                        ? { ...notif, isRead: true }
                        : notif
                    )
                  )
                  
                  // Call markAsRead (which will also update localStorage, but we already did it)
                  await markAsRead(allUnreadIds)
                  
                  // Force refresh of Header unread count
                  // Use multiple timeouts to ensure localStorage is read correctly
                  setTimeout(() => {
                    if (onNotificationsRead) {
                      onNotificationsRead()
                    }
                    // Also dispatch event to ensure Header updates
                    window.dispatchEvent(new CustomEvent('notifications-updated'))
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

