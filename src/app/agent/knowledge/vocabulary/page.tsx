"use client"

import { useState, useEffect } from "react"
import { Edit3, FileText, ChevronDown, BookOpen, ChevronUp, Search, History } from "lucide-react"
import Link from "next/link"
import vocabularyContent from "@/content/agent/knowledge/vocabulary.json"

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

export default function VocabularyKnowledgePage() {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const content = vocabularyContent.vocabulary

  useEffect(() => {
    fetchKnowledge()
  }, [])

  const fetchKnowledge = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/knowledge/vocabulary")
      if (response.ok) {
        const data = await response.json()
        setKnowledge(data)
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) newExpanded.delete(sectionId)
    else newExpanded.add(sectionId)
    setExpandedSections(newExpanded)
  }

  // Filter vocabulary based on search term
  const filteredVocabulary = knowledge?.detailKnowledges?.filter((detail) => {
    if (!searchTerm.trim()) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      detail.name.toLowerCase().includes(searchLower)
    )
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064379] to-[#0d0d0e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064379] mx-auto mb-4"></div>
          <p className="text-[#b2fcff]">{content.loading}</p>
        </div>
      </div>
    )
  }

  if (!knowledge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064379] to-[#0d0d0e] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-[#ffde59] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#b2fcff] mb-2">{content.emptyState.title}</h2>
          <p className="text-[#b2fcff]">{content.emptyState.description}</p>
        </div>
      </div>
    )
  }

  // Helper function to create slug from title
  const createSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/\s+/g, '-')
  }

  const knowledgeSlug = createSlug(knowledge.title)

  return (
    <>
    <div className="min-h-screen my-16 bg-gradient-to-br from-[#064379] to-[#0d0d0e] rounded-3xl">
      {/* Header Section */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center relative">
          {/* Tracer Button - Top Right */}
          <div className="absolute top-0 right-0">
            <Link 
              href={`/agent/knowledge/${knowledgeSlug}/tracer`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl backdrop-blur-sm bg-[#ffde59]/20 hover:bg-[#ffde59]/30 border border-[#ffde59]/30 text-[#ffde59]"
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Tracer Updates</span>
            </Link>
          </div>
          
          <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{knowledge.title}</h1>
          {knowledge.description && (
            <p className="text-xl text-[#ffde59] mb-6 max-w-3xl mx-auto">{knowledge.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-[#064379]/20 shadow-2xl p-8">
          <div className="flex justify-between items-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                {content.knowledgeDetails.title}
              </h2>
              <p className="text-white text-lg leading-relaxed">
                {content.knowledgeDetails.description}
              </p>
            </div>

            <div className="mb-8 relative w-[450px]">
              {/* Icon kaca pembesar */}
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#b2fcff] pointer-events-none" />

              <input
                type="text"
                placeholder="Cari vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white/80 backdrop-blur-sm rounded-xl text-[#064379] placeholder-gray-400 focus:ring-2 focus:ring-[#064379]/50 focus:border-[#064379]/50 focus:outline-none shadow-lg"
              />
              {/* Tombol clear */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#064379] transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

           {filteredVocabulary.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {filteredVocabulary
                 .slice() // buat salinan biar ga ubah data asli
                 .sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }))
                 .map((detail) => (
                  <div
                    key={detail.id}
                    className="hover:scale-103 bg-[#b2fcff] backdrop-blur-sm rounded-2xl border border-[#064379]/30 shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(detail.id)}
                      className="w-full p-6 text-left hover:bg-[#b2fcff]/10 transition-all duration-300 rounded-2xl cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {detail.logos.length > 0 && (
                            <div className="w-6 h-6 bg-gradient-to-br from-[#064379] to-[#064379]/80 rounded-full flex items-center justify-center shadow-lg">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          )}
                          <h3 className="font-bold text-[#064379] text-base">{detail.name}</h3>
                        </div>
                        {expandedSections.has(detail.id) ? (
                          <ChevronUp className="h-5 w-5 text-[#064379]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#064379]" />
                        )}
                      </div>
                    </button>

                    {expandedSections.has(detail.id) && (
                      <div className="px-6 pb-6 border-t border-[#064379]/20 bg-gradient-to-r from-[#b2fcff]/5 to-transparent">
                        <div className="pt-6">
                          {detail.description && (
                            <p className="text-sm text-[#064379] mb-4 leading-relaxed font-medium whitespace-pre-line">
                              {detail.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
           ) : searchTerm ? (
             <div className="text-center py-16">
               <FileText className="h-16 w-16 text-[#b2fcff]/60 mx-auto mb-6" />
               <h3 className="text-2xl font-bold text-[#b2fcff] mb-4">
                 Tidak ditemukan vocabulary
               </h3>
               <p className="text-[#b2fcff]/80 text-lg">
                 Tidak ada vocabulary yang cocok dengan pencarian &quot;{searchTerm}&quot;
               </p>
               <button
                 onClick={() => setSearchTerm("")}
                 className="mt-4 px-6 py-2 bg-[#064379] text-white rounded-lg hover:bg-[#064379]/80 transition-colors"
               >
                 Reset Pencarian
               </button>
             </div>
           ) : (
             <div className="text-center py-16">
               <FileText className="h-16 w-16 text-[#b2fcff]/60 mx-auto mb-6" />
               <h3 className="text-2xl font-bold text-[#b2fcff] mb-4">
                 {content.emptyState.title}
               </h3>
               <p className="text-[#b2fcff]/80 text-lg">{content.emptyState.description}</p>
             </div>
           )}
        </div>
      </div>
    </div>
    {/* Information Stats */}
    <div className="my-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8">
    <h3 className="text-2xl font-bold text-[#064379] mb-6 text-center flex items-center justify-center">
      <BookOpen className="h-6 w-6 mr-3" />
      Information
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
        <div className="text-4xl font-bold text-[#064379] mb-2">
          {knowledge.detailKnowledges.length}
        </div>
        <div className="text-sm text-[#064379]/80 font-medium">Total Vocabulary Items</div>
      </div>

      <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
        <div className="text-4xl font-bold text-[#064379] mb-2">
        {(() => {
          const date = new Date(knowledge.updatedAt || knowledge.createdAt);
          return `${date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })} ${date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}`;
        })()}
        </div>
        <div className="text-sm text-[#064379]/80 font-medium">
          {knowledge.updatedAt ? "Last Updated" : "Created On"}
        </div>
      </div>

      <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
        <div className="text-4xl font-bold text-[#064379] mb-2">
          {knowledge.updatedBy || knowledge.createdBy || "System"}
        </div>
        <div className="text-sm text-[#064379]/80 font-medium">
          {knowledge.updatedBy ? "Updated By" : "Created By"}
        </div>
      </div>

    </div>

    {/* Update Notes */}
    {knowledge.updateNotes && (
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
        <h4 className="text-lg font-bold text-[#064379] mb-3 flex items-center">
          <Edit3 className="h-5 w-5 mr-2" />
          Update Notes
        </h4>
        <p className="text-[#064379]/90 leading-relaxed">{knowledge.updateNotes}</p>
      </div>
    )}
  </div>
  </>
  )
}
