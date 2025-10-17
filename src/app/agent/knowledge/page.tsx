"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, BookOpen, Calendar, User, ChevronRight } from "lucide-react"

interface Knowledge {
  id: string
  title: string
  description?: string
  createdAt: string
  slug: string
}

export default function KnowledgeBasePage() {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchKnowledges()
  }, [])

  const fetchKnowledges = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/knowledge')
      if (response.ok) {
        const data = await response.json()
        setKnowledges(data)
      }
    } catch (error) {
      console.error('Error fetching knowledges:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredKnowledges = knowledges.filter(knowledge =>
    knowledge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (knowledge.description && knowledge.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-blue-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">
              Knowledge Base
            </h1>
            <p className="text-xl text-gray-300">
              Comprehensive knowledge and resources for your team
            </p>
          </div>
        </div>
      </div>

      {/* Search and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Information Stats */}
        {!loading && knowledges.length > 0 && (
          <div className="mb-12 bg-gradient-to-r from-gray-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">Knowledge Base Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{knowledges.length}</div>
                <div className="text-sm text-gray-300">Total Knowledge Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {new Set(knowledges.map(k => new Date(k.createdAt).getFullYear())).size}
                </div>
                <div className="text-sm text-gray-300">Years of Content</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {knowledges.filter(k => k.description).length}
                </div>
                <div className="text-sm text-gray-300">With Descriptions</div>
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading knowledge base...</p>
            </div>
          </div>
        ) : filteredKnowledges.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredKnowledges.map((knowledge) => (
              <Link
                key={knowledge.id}
                href={(() => {
                  const fixed = ['vocabulary', 'make-up-knowledge', 'skin-knowledge']
                  const slug = knowledge.title.toLowerCase().trim().replace(/ /g, '-')
                  return fixed.includes(slug) ? `/agent/knowledge/${slug}` : `/agent/knowledge/${slug}`
                })()}
                className="group bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-xl border border-cyan-300/30 hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-cyan-600 transition-colors mb-2">
                        {knowledge.title}
                      </h3>
                      {knowledge.description && (
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                          {knowledge.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-cyan-600 transition-colors" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{formatDate(knowledge.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              {searchTerm ? 'No matching knowledge found' : 'No knowledge base available'}
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Knowledge base items will appear here when available'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
