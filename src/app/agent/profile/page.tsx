"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/components/auth/AuthProvider"
import { User, Mail, Calendar, Award, TrendingUp, FileText, Clock, Camera, X, Upload, ArrowLeft, Edit, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"

interface Performance {
  id: string
  qaScore: number
  quizScore: number
  typingTestScore: number
  afrt: number
  art: number
  rt: number
  rr: number
  csat: number
  timestamp: string
}

interface AgentProfile {
  id: string
  name: string
  email: string
  foto: string | null
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  performances: Performance[]
  averageScores: {
    qaScore: number
    quizScore: number
    typingTestScore: number
    afrt: number
    art: number
    rt: number
    rr: number
    csat: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasFetchedRef = useRef(false)
  const currentUserIdRef = useRef<string | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Edit profile modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [editError, setEditError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Skip if already have profile data
    if (hasFetchedRef.current && profile) {
      return
    }

    // Skip if no user
    if (!user?.id) {
      if (!hasFetchedRef.current) {
        setError('User not found. Please login again.')
        setLoading(false)
      }
      return
    }

    // Skip if already fetched for this user
    if (hasFetchedRef.current && currentUserIdRef.current === user.id) {
      return
    }

    const fetchProfile = async (skipLoading = false) => {
      try {
        if (!skipLoading) {
          setLoading(true)
        }
        setError(null)
        hasFetchedRef.current = true
        currentUserIdRef.current = user.id

        const response = await fetch(`/api/agent/profile?userId=${user.id}&t=${Date.now()}`, {
          cache: 'no-store', // Always fetch fresh data
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 404) {
            setError('Profile not found. Please contact administrator.')
            setLoading(false)
            return
          }
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfile(data)
        // Initialize edit form with current data
        setEditForm({
          name: data.name,
          email: data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setLoading(false) // Set false after data is loaded, not in finally
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile. Please try again.')
        hasFetchedRef.current = false // Reset on error so it can retry
        setLoading(false)
      }
    }

    fetchProfile()

    // Auto-refresh every 30 seconds to get latest performance data
    refreshIntervalRef.current = setInterval(() => {
      if (user?.id) {
        fetchProfile(true) // Refresh in background without showing loading
      }
    }, 30000) // 30 seconds

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]) // Only depend on user.id - profile is checked via ref

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCategory = (category: string) => {
    return category
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError('Ukuran file terlalu besar. Maksimal 5MB.')
        return
      }

      setSelectedFile(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user?.id) {
      return
    }

    try {
      setUploading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`/api/agent/profile/photo?userId=${user.id}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload photo')
      }

      const data = await response.json()

      // Update profile with new photo URL
      if (profile) {
        setProfile({
          ...profile,
          foto: data.foto
        })
      }

      // Dispatch event to update header photo
      window.dispatchEvent(new CustomEvent('profile-photo-updated'))

      // Close modal and reset
      setShowUploadModal(false)
      setPreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error uploading photo:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleCancelUpload = () => {
    setShowUploadModal(false)
    setPreview(null)
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEditProfile = async () => {
    if (!user?.id) {
      setEditError('User tidak ditemukan')
      return
    }

    // Validate form
    if (!editForm.name.trim()) {
      setEditError('Nama tidak boleh kosong')
      return
    }

    if (!editForm.email.trim()) {
      setEditError('Email tidak boleh kosong')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editForm.email)) {
      setEditError('Format email tidak valid')
      return
    }

    // If changing password, validate password fields
    if (editForm.newPassword) {
      if (!editForm.currentPassword) {
        setEditError('Password saat ini diperlukan untuk mengubah password')
        return
      }

      if (editForm.newPassword.length < 6) {
        setEditError('Password baru minimal 6 karakter')
        return
      }

      if (editForm.newPassword !== editForm.confirmPassword) {
        setEditError('Password baru dan konfirmasi password tidak cocok')
        return
      }
    }

    try {
      setEditing(true)
      setEditError(null)

      const updateData: {
        name?: string
        email?: string
        currentPassword?: string
        newPassword?: string
      } = {
        name: editForm.name.trim(),
        email: editForm.email.trim()
      }

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword
        updateData.newPassword = editForm.newPassword
      }

      const response = await fetch(`/api/agent/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: editForm.name.trim(),
          email: editForm.email.trim()
        })
      }

      // Dispatch event to update header (name and photo)
      window.dispatchEvent(new CustomEvent('profile-updated'))
      
      // Also dispatch photo update event for backward compatibility
      window.dispatchEvent(new CustomEvent('profile-photo-updated'))

      // Close modal and reset form
      setShowEditModal(false)
      setEditForm({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setEditError(null)

      // Show success message or refresh
      if (editForm.newPassword) {
        alert('Profile dan password berhasil diubah. Silakan login ulang dengan password baru.')
        // Optionally log out user if password was changed
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setEditError(err instanceof Error ? err.message : 'Gagal mengupdate profile. Silakan coba lagi.')
    } finally {
      setEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditForm({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setEditError(null)
  }

  // Show skeleton instead of blocking loading screen

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#03438f] text-white rounded-lg hover:bg-[#0259b7] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="mb-8 mt-12">
              <div className="flex items-center space-x-4 mb-2">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              </div>
              <p className="text-gray-600 ml-14">View and manage your profile information</p>
            </div>

            {/* Profile Card */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="bg-gradient-to-r from-[#03438f] to-[#0259b7] px-8 py-12">
                  <div className="flex items-center space-x-6">
                    <div className="w-32 h-32 rounded-full bg-white/20"></div>
                    <div className="flex-1">
                      <div className="h-8 bg-white/20 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : profile ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-[#03438f] to-[#0259b7] px-8 py-12">
                <div className="flex items-center space-x-6">
                  {/* Profile Photo */}
                  <div className="relative group">
                    {profile.foto ? (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={profile.foto}
                          alt={profile.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          quality={100}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    {profile.isActive && (
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    )}
                    {/* Edit Photo Button */}
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-white">
                    <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                    <div className="flex items-center space-x-4 text-white/90">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>{formatCategory(profile.category)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-8">
                {/* Basic Information */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Informasi Dasar</h3>
                    <button
                      onClick={() => {
                        if (profile) {
                          setEditForm({
                            name: profile.name,
                            email: profile.email,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          })
                        }
                        setEditError(null)
                        setShowEditModal(true)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#03438f] text-white rounded-lg hover:bg-[#0259b7] transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Nama</p>
                        <p className="text-gray-900 font-medium">{profile.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900 font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Kategori</p>
                        <p className="text-gray-900 font-medium">{formatCategory(profile.category)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Bergabung Sejak</p>
                        <p className="text-gray-900 font-medium">{formatDate(profile.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Ringkasan Performa</h3>
                    <button
                      onClick={async () => {
                        setRefreshing(true)
                        try {
                          const response = await fetch(`/api/agent/profile?userId=${user?.id}&t=${Date.now()}`, {
                            cache: 'no-store',
                            headers: {
                              'Cache-Control': 'no-cache'
                            }
                          })
                          if (response.ok) {
                            const data = await response.json()
                            setProfile(data)
                          }
                        } catch (err) {
                          console.error('Error refreshing profile:', err)
                        } finally {
                          setRefreshing(false)
                        }
                      }}
                      disabled={refreshing}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">QA Score</span>
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{profile.averageScores.qaScore}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Quiz Score</span>
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-3xl font-bold text-green-600">{profile.averageScores.quizScore}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Typing Test</span>
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold text-purple-600">{profile.averageScores.typingTestScore}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">AFRT</span>
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-3xl font-bold text-orange-600">{profile.averageScores.afrt}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">ART</span>
                        <TrendingUp className="w-5 h-5 text-pink-600" />
                      </div>
                      <p className="text-3xl font-bold text-pink-600">{profile.averageScores.art}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">RT</span>
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                      </div>
                      <p className="text-3xl font-bold text-indigo-600">{profile.averageScores.rt}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">RR</span>
                        <TrendingUp className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-3xl font-bold text-teal-600">{profile.averageScores.rr}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">CSAT</span>
                        <TrendingUp className="w-5 h-5 text-yellow-600" />
                      </div>
                      <p className="text-3xl font-bold text-yellow-600">{profile.averageScores.csat}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata dari {profile.performances.length} penilaian</p>
                    </div>
                  </div>
                </div>

                {/* Recent Performance History */}
                {profile.performances.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Riwayat Performa Terbaru</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">Tanggal</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">QA</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">Quiz</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">Typing</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">AFRT</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">ART</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">RT</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">RR</th>
                            <th className="text-center py-3 px-2 text-xs sm:text-sm font-semibold text-gray-700">CSAT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profile.performances.map((performance) => (
                            <tr key={performance.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-2 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                                {formatDate(performance.timestamp)}
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {performance.qaScore}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {performance.quizScore}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {performance.typingTestScore}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {performance.afrt}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                  {performance.art}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {performance.rt}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                  {performance.rr}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs sm:text-sm text-center">
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {performance.csat}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {profile.performances.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Belum ada data performa</p>
                  </div>
                )}
              </div>
            </div>
            ) : null}
          </div>
        </div>

        {/* Upload Photo Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Ubah Foto Profil</h3>
                <button
                  onClick={handleCancelUpload}
                  disabled={uploading}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mb-6">
                {preview ? (
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                    <Image
                      src={preview}
                      alt="Preview"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                      quality={100}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 mx-auto rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`block w-full px-4 py-2 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploading
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-[#03438f] text-[#03438f] hover:bg-[#03438f] hover:text-white'
                  }`}
                >
                  <Upload className="w-5 h-5 inline-block mr-2" />
                  {selectedFile ? 'Pilih Foto Lain' : 'Pilih Foto'}
                </label>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Format: JPEG, PNG, WebP (Maks. 5MB)
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelUpload}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 px-4 py-2 bg-[#03438f] text-white rounded-lg hover:bg-[#0259b7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengunggah...
                    </>
                  ) : (
                    'Unggah Foto'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCancelEdit}>
            <div className="bg-white rounded-lg shadow-xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Edit Profile</h3>
                <button
                  onClick={handleCancelEdit}
                  disabled={editing}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{editError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={editing}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Masukkan nama"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    disabled={editing}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Masukkan email"
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-700">Ubah Password</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Kosongkan jika tidak ingin mengubah password
                  </p>

                  {/* Current Password */}
                  <div className="mb-4">
                    <label htmlFor="edit-current-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password Saat Ini
                    </label>
                    <input
                      id="edit-current-password"
                      type="password"
                      value={editForm.currentPassword}
                      onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                      disabled={editing}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Masukkan password saat ini"
                    />
                  </div>

                  {/* New Password */}
                  <div className="mb-4">
                    <label htmlFor="edit-new-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <input
                      id="edit-new-password"
                      type="password"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                      disabled={editing}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Masukkan password baru (min. 6 karakter)"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="edit-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      id="edit-confirm-password"
                      type="password"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                      disabled={editing}
                      className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Konfirmasi password baru"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  disabled={editing}
                  className="flex-1 px-4 py-2 text-sm md:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={editing}
                  className="flex-1 px-4 py-2 text-sm md:text-base bg-[#03438f] text-white rounded-lg hover:bg-[#0259b7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {editing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

