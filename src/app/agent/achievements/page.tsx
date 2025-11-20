"use client"

import { useEffect, useState } from "react"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Trophy, Medal, Award, TrendingUp, FileText, Clock, ArrowLeft, Calendar } from "lucide-react"
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

  useEffect(() => {
    const fetchTopAgents = async () => {
      try {
        // Only show loading on first load or when data is empty
        if (Object.keys(topAgentsByCategory).length === 0) {
          setLoading(true)
        }
        setError(null)

        const url = selectedMonth 
          ? `/api/agent/achievements?month=${selectedMonth}`
          : '/api/agent/achievements'
        
        const response = await fetch(url, {
          // Cache for faster loading
          next: { revalidate: 60 } // 1 minute cache
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch top agents')
        }

        const data = await response.json()
        setTopAgentsByCategory(data.topAgentsByCategory || {})
        setAllAgentsByCategory(data.allAgentsByCategory || {})
        setLoading(false) // Set false after data is loaded
      } catch (err) {
        console.error('Error fetching top agents:', err)
        setError('Failed to load achievements. Please try again.')
        setLoading(false)
      }
    }

    fetchTopAgents()
  }, [selectedMonth])

  const formatCategory = (category: string) => {
    return category
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600'
      case 2:
        return 'from-gray-300 to-gray-500'
      case 3:
        return 'from-amber-500 to-amber-700'
      default:
        return 'from-blue-500 to-blue-700'
    }
  }

  const getRankHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return 'h-96'
      case 2:
        return 'h-96'
      case 3:
        return 'h-96'
      default:
        return 'h-48'
    }
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="min-h-screen mt-12 flex items-center justify-center">
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen py-8">
          <div className="mx-auto px-6">
            {/* Header */}
            <div className="mb-8 mt-12">
              {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Kembali</span>
                </button>
              </div>

              {/* Main Header Card */}
              <div className="bg-gradient-to-r from-[#03438f] via-[#0259b7] to-[#017cff] rounded-2xl shadow-xl p-8 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Title Section */}
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      <Trophy className="w-10 h-10 text-yellow-300" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Report Performance Agent
                      </h1>
                      <p className="text-white/90 text-lg font-medium">
                        Bulan {formatMonthLabel(selectedMonth)}
                      </p>
                    </div>
                  </div>

                  {/* Month Filter */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-white" />
                      <label htmlFor="month-filter" className="text-sm font-semibold text-white">
                        Pilih Bulan:
                      </label>
                      <select
                        id="month-filter"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent shadow-lg border-0 min-w-[200px]"
                      >
                        {getAvailableMonths().map((month) => (
                          <option key={month} value={month}>
                            {formatMonthLabel(month)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 by Category */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl shadow-lg bg-white border border-gray-200 p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex items-end justify-center gap-4 mb-8">
                      <div className="flex-1 h-64 bg-gray-200 rounded-t-2xl"></div>
                      <div className="flex-1 h-80 bg-gray-200 rounded-t-2xl"></div>
                      <div className="flex-1 h-56 bg-gray-200 rounded-t-2xl"></div>
                    </div>
                    <div className="h-96 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : Object.keys(topAgentsByCategory).length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(topAgentsByCategory).map(([category, topAgents]) => (
                  <div key={category} className="rounded-xl shadow-lg bg-white border border-gray-200 p-6">
                    {/* Category Header */}
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCategory(category)}
                      </h2>
                      <div className="h-1 w-24 bg-gradient-to-r from-[#03438f] to-[#0259b7] rounded-full"></div>
                    </div>

                    {/* Top 3 Podium */}
                    {topAgents.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-end justify-center gap-4">

                          {/* 1st Place */}
                          {topAgents[0] && (
                            <div className="flex-1 flex flex-col items-center">
                              <div className={`w-full ${getRankHeight(1)} bg-gradient-to-t ${getRankColor(1)} rounded-t-2xl shadow-2xl flex flex-col items-center justify-end pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  {/* {getRankIcon(1)} */}
                                  <span className="text-white text-2xl font-bold mb-2">1st</span>
                                </div>
                                {topAgents[0].foto ? (
                                  <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
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
                                  <div className="w-56 h-56 rounded-full bg-white/20 border-4 border-white shadow-xl mb-4 flex items-center justify-center">
                                    <Trophy className="w-16 h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-xl font-bold text-center px-2">{topAgents[0].name}</h3>
                                <div className="mt-3 text-white text-3xl font-bold">
                                  {topAgents[0].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 2nd Place */}
                          {topAgents[1] && (
                            <div className="flex-1 flex flex-col items-center">
                              <div className={`w-full ${getRankHeight(2)} bg-gradient-to-t ${getRankColor(2)} rounded-t-2xl shadow-xl flex flex-col items-center justify-end pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  {/* {getRankIcon(2)} */}
                                  <span className="text-white text-2xl font-bold mb-2">2nd</span>
                                </div>
                                {topAgents[1].foto ? (
                                  <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
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
                                  <div className="w-56 h-56 rounded-full bg-white/20 border-4 border-white shadow-lg mb-4 flex items-center justify-center">
                                    <Trophy className="w-16 h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-lg font-bold text-center px-2">{topAgents[1].name}</h3>
                                <div className="mt-3 text-white text-2xl font-bold">
                                  {topAgents[1].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3rd Place */}
                          {topAgents[2] && (
                            <div className="flex-1 flex flex-col items-center">
                              <div className={`w-full ${getRankHeight(3)} bg-gradient-to-t ${getRankColor(3)} rounded-t-2xl shadow-xl flex flex-col items-center justify-end pb-6 relative`}>
                                <div className="flex flex-col items-center">
                                  {/* {getRankIcon(3)} */}
                                  <span className="text-white text-2xl font-bold mb-2">3rd</span>
                                </div>
                                {topAgents[2].foto ? (
                                  <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
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
                                  <div className="w-56 h-56 rounded-full bg-white/20 border-4 border-white shadow-lg mb-4 flex items-center justify-center">
                                    <Trophy className="w-16 h-16 text-white" />
                                  </div>
                                )}
                                <h3 className="text-white text-lg font-bold text-center px-2">{topAgents[2].name}</h3>
                                <div className="mt-3 text-white text-2xl font-bold">
                                  {topAgents[2].overallScore}%
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* All Agents Table */}
                    {allAgentsByCategory[category] && allAgentsByCategory[category].length > 0 && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <div className="relative max-h-[600px] overflow-y-auto">
                            <table className="w-full border-collapse">
                              <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#03438f] to-[#0259b7]">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Foto</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nama</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-white">QA Score</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-white">Quiz Score</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-white">Typing Test</th>
                                  <th className="px-4 py-3 text-center text-sm font-semibold text-white">Overall</th>
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
                                    <td className="px-4 py-3">
                                      {agent.foto ? (
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                          <Image
                                            src={agent.foto}
                                            alt={agent.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                            quality={100}
                                            unoptimized
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                                          <Trophy className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center space-x-2">
                                        {index < 3 && getRankIcon(index + 1)}
                                        <span className="font-medium text-gray-900">{agent.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                        {agent.averageScores.qaScore}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                        {agent.averageScores.quizScore}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                                        {agent.averageScores.typingTestScore}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-[#03438f] to-[#0259b7] text-white">
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
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Trophy className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Belum ada data achievements</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

