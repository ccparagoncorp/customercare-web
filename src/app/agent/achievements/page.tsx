"use client"

import { useEffect, useState, useCallback } from "react"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Trophy, Medal, Award, ArrowLeft, Calendar, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface TopAgent {
  id: string
  name: string
  email: string
  foto: string | null
  category: string
  overallScore: number
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

interface TopAgentsByCategory {
  [category: string]: TopAgent[]
}

export default function AchievementsPage() {
  const router = useRouter()
  const [topAgentsByCategory, setTopAgentsByCategory] = useState<TopAgentsByCategory>({})
  const [allAgentsByCategory, setAllAgentsByCategory] = useState<TopAgentsByCategory>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // Get current month as default (YYYY-MM format)
  const getCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
  }

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())

  // Generate list of months (last 12 months)
  const getAvailableMonths = () => {
    const months: string[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      months.push(`${year}-${month}`)
    }
    return months
  }

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(Number(year), Number(month) - 1, 1)
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
  }

  const fetchTopAgents = useCallback(async (showRefreshing = false, month?: string) => {
    const monthToUse = month || selectedMonth
    try {
      // Only show loading on first load or when data is empty
      if (showRefreshing) {
        setRefreshing(true)
      } else if (Object.keys(topAgentsByCategory).length === 0) {
        setLoading(true)
      }
      setError(null)

      const url = monthToUse 
        ? `/api/agent/achievements?month=${monthToUse}&t=${Date.now()}`
        : `/api/agent/achievements?t=${Date.now()}`
      
      const response = await fetch(url, {
        cache: 'no-store', // Always fetch fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch top agents')
      }

      const data = await response.json()
      setTopAgentsByCategory(data.topAgentsByCategory || {})
      setAllAgentsByCategory(data.allAgentsByCategory || {})
      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      console.error('Error fetching top agents:', err)
      setError('Failed to load achievements. Please try again.')
      setLoading(false)
      setRefreshing(false)
    }
  }, [selectedMonth, topAgentsByCategory])

  useEffect(() => {
    fetchTopAgents()
  }, [fetchTopAgents])

  // Auto-refresh every 30 seconds to get latest data
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh in background - don't show loading state
      fetchTopAgents(true)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchTopAgents])

  const formatCategory = (category: string) => {
    return category
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getRankIcon = (rank: number) => {
    // Responsive icon sizes
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-yellow-500 flex-shrink-0" />
      case 2:
        return <Medal className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-400 flex-shrink-0" />
      case 3:
        return <Award className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-amber-600 flex-shrink-0" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-600 to-yellow-800'
      case 2:
        return 'from-gray-500 to-gray-700'
      case 3:
        return 'from-amber-700 to-amber-900'
      default:
        return 'from-blue-500 to-blue-700'
    }
  }

  const getRankHeight = (rank: number) => {
    // Responsive heights: smaller on mobile
    switch (rank) {
      case 1:
        return 'h-64 md:h-80 lg:h-96'
      case 2:
        return 'h-60 md:h-76 lg:h-96'
      case 3:
        return 'h-56 md:h-72 lg:h-96'
      default:
        return 'h-48'
    }
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen mt-8 md:mt-12 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-600 mb-4 text-sm md:text-base">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#03438f] text-white rounded-lg hover:bg-[#0259b7] transition-colors text-sm md:text-base"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen py-4 md:py-8">
          <div className="mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="mb-6 md:mb-8 mt-12 md:mt-12">
              {/* Back Button */}
              <div className="mb-3 md:mb-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm md:text-base"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium">Kembali</span>
                </button>
              </div>

              {/* Main Header Card */}
              <div className="bg-gradient-to-r from-[#03438f] via-[#0259b7] to-[#017cff] rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 mb-4 md:mb-6">
                <div className="flex flex-col gap-4 md:gap-6">
                  {/* Title Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="bg-white/20 backdrop-blur-sm p-2 md:p-4 rounded-lg md:rounded-xl flex-shrink-0">
                        <Trophy className="w-6 h-6 md:w-10 md:h-10 text-yellow-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                          Report Performance Agent
                        </h1>
                        <p className="text-white/90 text-sm md:text-lg font-medium">
                          Bulan {formatMonthLabel(selectedMonth)}
                        </p>
                      </div>
                    </div>
                    {/* Month Filter - Full width on mobile */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/20 flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                            <label htmlFor="month-filter" className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                              Pilih Bulan:
                            </label>
                          </div>
                          <select
                            id="month-filter"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full sm:min-w-[200px] px-3 md:px-4 py-2 bg-white text-gray-900 rounded-lg text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent shadow-lg border-0"
                          >
                            {getAvailableMonths().map((month) => (
                              <option key={month} value={month}>
                                {formatMonthLabel(month)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => fetchTopAgents(true)}
                        disabled={refreshing}
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Refresh data"
                      >
                        <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${refreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Top 3 by Category */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-lg md:rounded-xl shadow-lg bg-white border border-gray-200 p-4 md:p-6 animate-pulse">
                    <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3 mb-3 md:mb-4"></div>
                    <div className="flex items-end justify-center gap-2 md:gap-4 mb-4 md:mb-8">
                      <div className="flex-1 h-48 md:h-64 bg-gray-200 rounded-t-xl md:rounded-t-2xl"></div>
                      <div className="flex-1 h-56 md:h-80 bg-gray-200 rounded-t-xl md:rounded-t-2xl"></div>
                      <div className="flex-1 h-44 md:h-56 bg-gray-200 rounded-t-xl md:rounded-t-2xl"></div>
                    </div>
                    <div className="h-64 md:h-96 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : Object.keys(topAgentsByCategory).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {Object.entries(topAgentsByCategory).map(([category, topAgents]) => (
                  <div key={category} className="rounded-lg md:rounded-xl shadow-lg bg-white border border-gray-200 p-4 md:p-6">
                    {/* Category Header */}
                    <div className="mb-4 md:mb-6">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {formatCategory(category)}
                      </h2>
                      <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#03438f] to-[#0259b7] rounded-full"></div>
                    </div>

                    {/* Top 3 Podium */}
                    {topAgents.length > 0 && (
                      <div className="mb-4 md:mb-8">
                        <div className="flex items-end justify-center gap-2 md:gap-4">

                          {/* 1st Place */}
                          {topAgents[0] && (
                            <div className="flex-1 flex flex-col items-center min-w-0">
                              <div className={`w-full ${getRankHeight(1)} bg-gradient-to-t ${getRankColor(1)} rounded-t-xl md:rounded-t-2xl shadow-2xl flex flex-col items-center justify-end pb-3 md:pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  <span className="text-white text-sm md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">1st</span>
                                </div>
                                {topAgents[0].foto ? (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-xl mb-2 md:mb-4">
                                    <Image
                                      src={topAgents[0].foto}
                                      alt={topAgents[0].name}
                                      width={224}
                                      height={224}
                                      className="w-full h-full object-cover"
                                      quality={100}
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full bg-white/20 border-2 md:border-4 border-white shadow-xl mb-2 md:mb-4 flex items-center justify-center">
                                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-xl font-bold text-center px-1 md:px-2 line-clamp-2">{topAgents[0].name}</h3>
                                <div className="mt-1 md:mt-3 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                                  {topAgents[0].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 2nd Place */}
                          {topAgents[1] && (
                            <div className="flex-1 flex flex-col items-center min-w-0">
                              <div className={`w-full ${getRankHeight(2)} bg-gradient-to-t ${getRankColor(2)} rounded-t-xl md:rounded-t-2xl shadow-xl flex flex-col items-center justify-end pb-3 md:pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  <span className="text-white text-sm md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">2nd</span>
                                </div>
                                {topAgents[1].foto ? (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg mb-2 md:mb-4">
                                    <Image
                                      src={topAgents[1].foto}
                                      alt={topAgents[1].name}
                                      width={224}
                                      height={224}
                                      className="w-full h-full object-cover"
                                      quality={100}
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full bg-white/20 border-2 md:border-4 border-white shadow-lg mb-2 md:mb-4 flex items-center justify-center">
                                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold text-center px-1 md:px-2 line-clamp-2">{topAgents[1].name}</h3>
                                <div className="mt-1 md:mt-3 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                                  {topAgents[1].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3rd Place */}
                          {topAgents[2] && (
                            <div className="flex-1 flex flex-col items-center min-w-0">
                              <div className={`w-full ${getRankHeight(3)} bg-gradient-to-t ${getRankColor(3)} rounded-t-xl md:rounded-t-2xl shadow-xl flex flex-col items-center justify-end pb-3 md:pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  <span className="text-white text-sm md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">3rd</span>
                                </div>
                                {topAgents[2].foto ? (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg mb-2 md:mb-4">
                                    <Image
                                      src={topAgents[2].foto}
                                      alt={topAgents[2].name}
                                      width={224}
                                      height={224}
                                      className="w-full h-full object-cover"
                                      quality={100}
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 rounded-full bg-white/20 border-2 md:border-4 border-white shadow-lg mb-2 md:mb-4 flex items-center justify-center">
                                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold text-center px-1 md:px-2 line-clamp-2">{topAgents[2].name}</h3>
                                <div className="mt-1 md:mt-3 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                                  {topAgents[2].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* All Agents Table - Mobile: Card view, Desktop: Table view */}
                    {allAgentsByCategory[category] && allAgentsByCategory[category].length > 0 && (
                      <>
                        {/* Mobile: Card View */}
                        <div className="md:hidden space-y-3">
                          {allAgentsByCategory[category].map((agent, index) => (
                            <div
                              key={agent.id}
                              className={`rounded-lg border-2 p-3 ${
                                index < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3 mb-3">
                                {agent.foto ? (
                                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                    <Image
                                      src={agent.foto}
                                      alt={agent.name}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover"
                                      quality={100}
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    {index < 3 && <div className="flex-shrink-0">{getRankIcon(index + 1)}</div>}
                                    <span className="font-medium text-gray-900 text-sm truncate">{agent.name}</span>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">Rank #{index + 1}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-lg font-bold bg-gradient-to-r from-[#03438f] to-[#0259b7] text-white px-2 py-1 rounded">
                                    {agent.overallScore}%
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">QA</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                    {agent.averageScores.qaScore}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">Quiz</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                    {agent.averageScores.quizScore}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">Typing</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                    {agent.averageScores.typingTestScore}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">AFRT</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                    {agent.averageScores.afrt}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">ART</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
                                    {agent.averageScores.art}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">RT</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                    {agent.averageScores.rt}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">RR</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                                    {agent.averageScores.rr}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">CSAT</div>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                    {agent.averageScores.csat}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop: Table View */}
                        <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <div className="relative max-h-[600px] overflow-y-auto">
                              <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#03438f] to-[#0259b7]">
                                  <tr>
                                    <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs font-semibold text-white">Foto</th>
                                    <th className="px-2 md:px-3 py-2 md:py-3 text-left text-xs font-semibold text-white">Nama</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">QA</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">Quiz</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">Typing</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">AFRT</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">ART</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">RT</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">RR</th>
                                    <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-semibold text-white">CSAT</th>
                                    <th className="px-2 md:px-3 py-2 md:py-3 text-center text-xs font-semibold text-white">Overall</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allAgentsByCategory[category].map((agent, index) => (
                                    <tr
                                      key={agent.id}
                                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                                        index < 3 ? 'bg-yellow-50/30' : ''
                                      }`}
                                    >
                                      <td className="px-2 md:px-3 py-2 md:py-3">
                                        {agent.foto ? (
                                          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-gray-200">
                                            <Image
                                              src={agent.foto}
                                              alt={agent.name}
                                              width={56}
                                              height={56}
                                              className="w-full h-full object-cover"
                                              quality={100}
                                              unoptimized
                                            />
                                          </div>
                                        ) : (
                                          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                                            <Trophy className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-2 md:px-3 py-2 md:py-3">
                                        <div className="flex items-center space-x-1 md:space-x-2">
                                          {index < 3 && <div className="flex-shrink-0">{getRankIcon(index + 1)}</div>}
                                          <span className="font-medium text-gray-900 text-xs md:text-sm">{agent.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                          {agent.averageScores.qaScore}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                          {agent.averageScores.quizScore}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                          {agent.averageScores.typingTestScore}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                          {agent.averageScores.afrt}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
                                          {agent.averageScores.art}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                          {agent.averageScores.rt}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                                          {agent.averageScores.rr}
                                        </span>
                                      </td>
                                      <td className="px-1 md:px-2 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                          {agent.averageScores.csat}
                                        </span>
                                      </td>
                                      <td className="px-2 md:px-3 py-2 md:py-3 text-center">
                                        <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold bg-gradient-to-r from-[#03438f] to-[#0259b7] text-white">
                                          {agent.overallScore}%
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-16">
                <Trophy className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-3 md:mb-4" />
                <p className="text-gray-500 text-sm md:text-lg">Belum ada data achievements</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

