"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, User, Edit3, FileText, ChevronRight, ChevronDown, BookOpen, Tag } from "lucide-react"

interface Knowledge {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
  logos: string[]
  updateNotes?: string
  detailKnowledges: DetailKnowledge[]
}

interface DetailKnowledge {
  id: string
  name: string
  description?: string
  logos: string[]
  jenisDetailKnowledges: JenisDetailKnowledge[]
}

interface JenisDetailKnowledge {
  id: string
  name: string
  description?: string
  logos: string[]
  produkJenisDetailKnowledges: ProdukJenisDetailKnowledge[]
}

interface ProdukJenisDetailKnowledge {
  id: string
  name: string
  description?: string
  logos: string[]
}

interface KnowledgeContentProps {
  slug: string
}

export function KnowledgeContent({ slug }: KnowledgeContentProps) {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchKnowledge()
  }, [slug])

  const fetchKnowledge = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/knowledge/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setKnowledge(data)
      }
    } catch (error) {
      console.error('Error fetching knowledge:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge...</p>
        </div>
      </div>
    )
  }

  if (!knowledge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Not Found</h2>
          <p className="text-gray-600">The knowledge you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-blue-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                {knowledge.logos.length > 0 && (
                  <div className="flex space-x-2">
                    {knowledge.logos.slice(0, 3).map((logo, index) => (
                      <div key={index} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image
                          src={logo}
                          alt={`Logo ${index + 1}`}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <h1 className="text-4xl font-bold text-yellow-400">{knowledge.title}</h1>
              </div>
              
              {knowledge.description && (
                <p className="text-xl text-gray-300 mb-6 max-w-3xl">{knowledge.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(knowledge.createdAt)}</span>
                </div>
                {knowledge.updatedAt !== knowledge.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Edit3 className="h-4 w-4" />
                    <span>Updated: {formatDate(knowledge.updatedAt)}</span>
                  </div>
                )}
                {knowledge.createdBy && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>By: {knowledge.createdBy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-cyan-300/30 shadow-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-cyan-600" />
                  Knowledge Details
                </h2>

                {knowledge.detailKnowledges.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {knowledge.detailKnowledges.map((detail) => (
                      <div key={detail.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-cyan-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <button
                          onClick={() => toggleSection(detail.id)}
                          className="w-full p-4 text-left hover:bg-white/90 transition-all duration-300 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {detail.logos.length > 0 && (
                                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Image
                                    src={detail.logos[0]}
                                    alt={detail.name}
                                    width={16}
                                    height={16}
                                    className="rounded"
                                  />
                                </div>
                              )}
                              <h3 className="font-bold text-gray-900 text-sm">{detail.name}</h3>
                            </div>
                            {expandedSections.has(detail.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {expandedSections.has(detail.id) && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="pt-4">
                              {detail.description && (
                                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{detail.description}</p>
                              )}
                              
                              {detail.jenisDetailKnowledges.length > 0 && (
                                <div className="space-y-3">
                                  {detail.jenisDetailKnowledges.map((jenis) => (
                                    <div key={jenis.id} className="bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center space-x-2 mb-2">
                                        {jenis.logos.length > 0 && (
                                          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                                            <Image
                                              src={jenis.logos[0]}
                                              alt={jenis.name}
                                              width={12}
                                              height={12}
                                              className="rounded"
                                            />
                                          </div>
                                        )}
                                        <h4 className="font-medium text-gray-900 text-sm">{jenis.name}</h4>
                                      </div>
                                      
                                      {jenis.description && (
                                        <p className="text-xs text-gray-600 mb-2">{jenis.description}</p>
                                      )}

                                      {jenis.produkJenisDetailKnowledges.length > 0 && (
                                        <div className="space-y-1">
                                          <h5 className="text-xs font-medium text-gray-700 mb-1">Products:</h5>
                                          <div className="space-y-1">
                                            {jenis.produkJenisDetailKnowledges.map((produk) => (
                                              <div key={produk.id} className="bg-white rounded border p-2">
                                                <div className="flex items-center space-x-2">
                                                  {produk.logos.length > 0 && (
                                                    <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                                                      <Image
                                                        src={produk.logos[0]}
                                                        alt={produk.name}
                                                        width={10}
                                                        height={10}
                                                        className="rounded"
                                                      />
                                                    </div>
                                                  )}
                                                  <span className="text-xs font-medium text-gray-900">{produk.name}</span>
                                                </div>
                                                {produk.description && (
                                                  <p className="text-xs text-gray-500 mt-1">{produk.description}</p>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Details Available</h3>
                    <p className="text-gray-500">This knowledge base doesn't have detailed information yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-cyan-400 mb-1">Last Updated</h4>
                  <p className="text-sm text-gray-300">{formatDate(knowledge.updatedAt)}</p>
                </div>

                {knowledge.updateNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-1">Update Notes</h4>
                    <p className="text-sm text-gray-300">{knowledge.updateNotes}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-cyan-400 mb-1">Sections</h4>
                  <p className="text-sm text-gray-300">{knowledge.detailKnowledges.length} detail sections</p>
                </div>

                {knowledge.logos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-cyan-400 mb-2">Logos</h4>
                    <div className="flex flex-wrap gap-2">
                      {knowledge.logos.map((logo, index) => (
                        <div key={index} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Image
                            src={logo}
                            alt={`Logo ${index + 1}`}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
