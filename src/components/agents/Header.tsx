"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "../auth/AuthProvider"
import { NotificationDropdown } from "./NotificationDropdown"
import { SearchDropdown } from "./SearchDropdown"
import dashboardContent from "@/content/agent/dashboard.json"
import Image from "next/image"

export function Header() {
  const router = useRouter()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileFoto, setProfileFoto] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hasFetchedFotoRef = useRef(false)
  
  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      // Fetch recent notifications (last 100)
      const response = await fetch('/api/notifications?limit=100')
      if (response.ok) {
        const data = await response.json()
        const notifications = data.notifications || []
        
        // Get read notification IDs from localStorage
        // Use try-catch in case localStorage is not available
        let readIds: string[] = []
        try {
          const readIdsStr = localStorage.getItem('readNotifications')
          if (readIdsStr) {
            readIds = JSON.parse(readIdsStr) as string[]
          }
        } catch (e) {
          console.warn('Error reading from localStorage:', e)
          readIds = []
        }
        
        // Count only unread notifications from the recent ones
        // Use Set for faster lookup
        const readIdsSet = new Set(readIds)
        const unreadNotifications = notifications.filter(
          (notif: { id: string }) => !readIdsSet.has(notif.id)
        )
        
        const newUnreadCount = unreadNotifications.length
        setUnreadCount(newUnreadCount)
        
        // Debug logging (can be removed later)
        if (process.env.NODE_ENV === 'development') {
          console.log('Unread count updated:', {
            totalNotifications: notifications.length,
            readIds: readIds.length,
            unreadCount: newUnreadCount
          })
        }
      } else {
        // If API fails, set to 0
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      // Set to 0 on error to avoid showing stale count
      setUnreadCount(0)
    }
  }, [])

  // Listen for storage events to update unread count when notifications are marked as read
  useEffect(() => {
    // Listen for custom event when notifications are marked as read
    const handleNotificationsUpdated = () => {
      // Add delay to ensure localStorage is updated first
      setTimeout(() => {
        fetchUnreadCount()
      }, 300)
    }
    
    // Listen for storage events (in case localStorage changes from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      // Only react to changes to readNotifications
      if (e.key === 'readNotifications') {
        setTimeout(() => {
          fetchUnreadCount()
        }, 100)
      }
    }
    
    window.addEventListener('notifications-updated', handleNotificationsUpdated)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('notifications-updated', handleNotificationsUpdated)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [fetchUnreadCount])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  // Fetch profile data (foto and name)
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/agent/profile?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.foto) {
            setProfileFoto(data.foto)
          }
          if (data.name) {
            setUserName(data.name)
          }
          hasFetchedFotoRef.current = true
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
      }
    }

    // Initialize with user name from auth
    if (user?.name) {
      setUserName(user.name)
    }

    if (user?.id) {
      fetchProfileData()
    }

    // Listen for profile updates (photo, name, email)
    const handleProfileUpdate = () => {
      hasFetchedFotoRef.current = false
      if (user?.id) {
        fetchProfileData()
      }
    }

    window.addEventListener('profile-photo-updated', handleProfileUpdate)
    window.addEventListener('profile-updated', handleProfileUpdate)

    return () => {
      window.removeEventListener('profile-photo-updated', handleProfileUpdate)
      window.removeEventListener('profile-updated', handleProfileUpdate)
    }
  }, [user?.id, user?.name])

  // Set up polling for unread count
  useEffect(() => {
    // Fetch immediately
    fetchUnreadCount()

    // Then poll every 30 seconds
    notificationIntervalRef.current = setInterval(fetchUnreadCount, 30000)

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current)
      }
    }
  }, [fetchUnreadCount])

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (notificationOpen) {
        setNotificationOpen(false)
      }
    }

    if (notificationOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [notificationOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">

        <div className="flex items-center justify-center">
          <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={39}
              className="hidden lg:block"
            />
            <Image
              src="/logomini.png"
              alt="Logo kecil"
              width={40}
              height={28}
              className="block lg:hidden" // tampil di layar kecil (sm–md)
              priority
            />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim().length > 0) {
                setSearchOpen(false)
                router.push(`/agent/search?q=${encodeURIComponent(searchQuery.trim())}`)
              }
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.trim().length > 0) {
                  setSearchOpen(true)
                } else {
                  setSearchOpen(false)
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setSearchOpen(true)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchOpen(false)
                  searchInputRef.current?.blur()
                }
              }}
              placeholder={dashboardContent.header.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent"
            />
          </form>
          
          {/* Search Dropdown */}
          <SearchDropdown
            query={searchQuery}
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        </div>

        {/* Right Side - Notifications and User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setNotificationOpen(!notificationOpen)
              }}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600 hover:text-[#03438f]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {notificationOpen && (
              <NotificationDropdown
                isOpen={notificationOpen}
                onClose={() => {
                  setNotificationOpen(false)
                  // Refresh unread count when dropdown closes
                  setTimeout(() => {
                    fetchUnreadCount()
                  }, 200)
                }}
                onNotificationsRead={() => {
                  // Refresh unread count when notifications are marked as read
                  // Use setTimeout to ensure localStorage is updated first
                  setTimeout(() => {
                    fetchUnreadCount()
                  }, 400)
                }}
              />
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-[#03438f] transition-colors"
            >
              {profileFoto ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={profileFoto}
                    alt={userName || user?.name || 'User'}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    quality={100}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="font-medium">{userName || user?.name || 'User'}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-3">
                  {profileFoto ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                      <Image
                        src={profileFoto}
                        alt={userName || user?.name || 'User'}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        quality={100}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{userName || user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{dashboardContent.header.user.role}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setUserMenuOpen(false)
                    router.push('/agent/profile')
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{dashboardContent.header.user.profile}</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{dashboardContent.header.user.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
