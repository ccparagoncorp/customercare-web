"use client"

import { useState, useEffect } from "react"
import { Edit3, FileText, BookOpen, ChevronUp, ChevronDown, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import skinContent from "@/content/agent/knowledge/skin.json"

interface Knowledge {
  id: string
  title: string
  description?: string
  image?: string
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
  image?: string
  introText?: string
  jenisDetailKnowledges: JenisDetailKnowledge[]
}

interface JenisDetailKnowledge {
  id: string
  name: string
  description?: string
  logos: string[]
  image?: string
  introText?: string
  produkJenisDetailKnowledges: ProdukJenisDetailKnowledge[]
}

interface ProdukJenisDetailKnowledge {
  id: string
  name: string
  description?: string
  logos: string[]
  image?: string
}

export default function SkinKnowledgePage() {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())

  const content = skinContent['skin-knowledge']
  
  // Get all detail knowledges to display as separate sections
  const allDetailKnowledges = knowledge?.detailKnowledges || []

  // Function to get design configuration based on detailKnowledge name
  const getDesignConfig = (detailName: string) => {
    const name = detailName.toLowerCase()
    
    if (name.includes('struktur') || name.includes('structure')) {
      return {
        type: 'structure',
        showImage: true,
        showDescription: true,
        showProducts: true,
        layout: 'two-column' // left detailed, right summary
      }
    } else if (name.includes('fungsi') || name.includes('function')) {
      return {
        type: 'function',
        showImage: true,
        showDescription: true,
        showProducts: false,
        layout: 'vertical'
      }
    } else if (name.includes('jenis') || name.includes('type') || name.includes('skintone')) {
      return {
        type: 'types',
        showImage: true,
        showDescription: true,
        showProducts: true,
        layout: 'table' // table format for skin types
      }
    }
    
    // Default design
    return {
      type: 'default',
      showImage: true,
      showDescription: true,
      showProducts: true,
      layout: 'horizontal'
    }
  }

  // Function to format description with numbered lists
  const formatDescription = (description: string) => {
    const lines = description.split('\n')
    
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          // Check if line starts with number pattern (1., 2., etc or 1), 2), etc)
          const numberMatch = line.match(/^(\d+)[.)]\s*(.*)/)
          if (numberMatch) {
            const [, number, content] = numberMatch
            return (
              <div key={index} className="flex items-start gap-2">
                <div className="bg-[#064379] text-[#ffffff] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {number}
                </div>
                <p className="text-[#064379] leading-relaxed flex-1 text-sm">{content}</p>
              </div>
            )
          }
          
          // Regular line
          if (line.trim()) {
            return (
              <p key={index} className="text-[#064379] leading-relaxed text-lg">
                {line}
              </p>
            )
          }
          
          return null
        })}
      </div>
    )
  }

  // Function to render image with fallback
  const renderImage = (jenis: JenisDetailKnowledge | ProdukJenisDetailKnowledge, size: string = 'w-64 h-64') => {
    const logos = jenis.logos && jenis.logos.length > 0 ? jenis.logos[0] : null
    
    return (
      <div className={`${size} mx-auto rounded-lg overflow-hidden relative`}>
        {logos ? (
          <>
            <Image
              src={
                logos.startsWith('http') 
                  ? logos 
                  : logos.startsWith('/') 
                  ? logos 
                  : logos.startsWith('public/')
                  ? logos.replace('public/', '/')
                  : logos.startsWith('images/')
                  ? `/${logos}`
                  : `/images/${logos}`
              }
              alt={jenis.name}
              width={192}
              height={192}
              className="w-full h-full object-cover"
              priority={false}
              unoptimized={true}
              onError={(e) => {
                console.log('Image failed to load:', logos);
                const target = e.target as HTMLImageElement;
                const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
                if (fallback) {
                  target.style.display = 'none';
                  fallback.classList.remove('hidden');
                  fallback.classList.add('flex', 'items-center', 'justify-center');
                }
              }}
            />
            <div className="hidden fallback-image w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 absolute inset-0">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Image not found</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Function to toggle products visibility
  const toggleProducts = (jenisId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jenisId)) {
        newSet.delete(jenisId)
      } else {
        newSet.add(jenisId)
      }
      return newSet
    })
  }

  useEffect(() => {
    fetchKnowledge()
  }, [])

  const fetchKnowledge = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/knowledge/skin-knowledge")
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

  // Filter function (currently no search functionality, return all)
  const filteredDetailKnowledges = allDetailKnowledges

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064379] to-[#0d0d0e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffde59] mx-auto mb-4"></div>
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

  return (
    <div className="min-h-screen my-16 rounded-3xl">
      {/* Header Section */}
      <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{knowledge.title || content.title}</h1>
        </div>
      </div>

      <div className="mt-8">
        {/* Information Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-[#064379] mb-6 text-center flex items-center justify-center">
            <BookOpen className="h-6 w-6 mr-3" />
            {content.information.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
              <div className="text-4xl font-bold text-[#064379] mb-2">
                {knowledge.detailKnowledges.length}
              </div>
              <div className="text-sm text-[#064379]/80 font-medium">Total Skin Knowledge Items</div>
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

        <div className="flex justify-between items-start gap-6">
          {/* LEFT SECTION - Main Knowledge Image and Description */}
          {(knowledge.logos || knowledge.description) && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 flex-1 h-155">
              <h2 className="text-3xl font-bold text-[#064379] mb-2 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                {content.knowledgeDetails.title}
              </h2>
              <div className={`grid grid-cols-1 ${knowledge.logos && knowledge.logos.length > 0 && knowledge.logos[0] ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8 items-center`}>
                
                {/* Image Section */}
                {knowledge.logos && knowledge.logos.length > 0 && knowledge.logos[0] && (
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative w-full h-80 overflow-hidden">
                      <Image
                        src={
                          knowledge.logos[0].startsWith('http')
                            ? knowledge.logos[0]
                            : knowledge.logos[0].startsWith('/')
                            ? knowledge.logos[0]
                            : knowledge.logos[0].startsWith('public/')
                            ? knowledge.logos[0].replace('public/', '/')
                            : knowledge.logos[0].startsWith('images/')
                            ? `/${knowledge.logos[0]}`
                            : `/images/${knowledge.logos[0]}`
                        }
                        alt={knowledge.title}
                        fill
                        className="object-contain"
                        priority={true}
                        unoptimized={true}
                        onLoad={() => {
                          console.log('Image loaded successfully:', knowledge.logos[0]);
                        }}
                        onError={(e) => {
                          console.log('Image failed to load:', knowledge.logos[0]);
                          const target = e.target as HTMLImageElement;
                          const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
                          if (fallback) {
                            target.style.display = 'none';
                            fallback.classList.remove('hidden');
                            fallback.classList.add('flex', 'items-center', 'justify-center');
                          }
                        }}
                      />
                      <div className="hidden fallback-image absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center">
                          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Image not found</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description Section */}
                {knowledge.description && (
                  <div className={`flex flex-col justify-center ${!(knowledge.logos && knowledge.logos.length > 0 && knowledge.logos[0]) ? 'text-center lg:col-span-1' : ''}`}>
                    <div className={`text-[#064379]/90 leading-relaxed text-lg ${!(knowledge.logos && knowledge.logos.length > 0 && knowledge.logos[0]) ? 'max-w-4xl mx-auto' : ''}`}>
                      {formatDescription(knowledge.description)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RIGHT SECTION - Last Knowledge Description */}
          {allDetailKnowledges.length > 0 && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 flex-1 h-155">
              <h2 className="text-3xl font-bold text-[#064379] mb-6 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                {allDetailKnowledges[allDetailKnowledges.length - 1].name}
              </h2>
              
              {allDetailKnowledges[allDetailKnowledges.length - 1].description && (
                <div className="text-[#064379]/90 leading-relaxed text-lg">
                  {formatDescription(allDetailKnowledges[allDetailKnowledges.length - 1].description || '')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content - Each detailKnowledge as separate section (excluding last) */}
        <div className="space-y-12 mt-8">
          {filteredDetailKnowledges.length > 0 ? (
            filteredDetailKnowledges
              .filter((_, index) => index < filteredDetailKnowledges.length - 1) // Exclude last item
              .map((detail) => {
                return (
                  <div key={detail.id} className="rounded-xl shadow-lg overflow-hidden">
                    {/* Section Banner Header */}
                    <div className="bg-gradient-to-r from-[#064379] to-[#0d0d0e] p-8">
                      <h2 className="text-2xl font-bold text-white text-center">{detail.name}</h2>
                    </div>
                
                    
                    {/* Section Content */}
                    <div className="bg-white/80 backdrop-blur-sm p-8">
                      {detail.jenisDetailKnowledges && detail.jenisDetailKnowledges.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {detail.jenisDetailKnowledges.map((jenis) => (
                            <div key={jenis.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                              <div className="flex flex-col md:flex-row gap-6">
                                {/* Image Section for jenis.logos */}
                                {jenis.logos && jenis.logos.length > 0 && jenis.logos[0] && (
                                  <div className="flex-shrink-0">
                                    {renderImage(jenis, 'w-80 h-80')}
                                  </div>
                                )}
                                
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-[#064379] mb-4">{jenis.name}</h3>
                                  {jenis.description && (
                                    <p className="text-[#064379] leading-relaxed text-sm whitespace-pre-line">
                                      {jenis.description}
                                    </p>
                                  )}
                                  
                                  {/* Show produk jika ada */}
                                  {jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.length > 0 && (
                                    <div className="mt-4">
                                      <button
                                        onClick={() => toggleProducts(jenis.id)}
                                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                      >
                                        <span className="font-bold text-sm">Lihat Detail</span>
                                        <div className="flex items-center gap-2">
                                          {expandedProducts.has(jenis.id) ? (
                                            <ChevronUp className="h-4 w-4" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4" />
                                          )}
                                        </div>
                                      </button>
                                      
                                      {expandedProducts.has(jenis.id) && (
                                        <div className="mt-6 space-y-4">
                                          {jenis.produkJenisDetailKnowledges.map((produk) => (
                                            <div key={produk.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                              <div className="flex items-start gap-4">
                                                {/* Image Section for produk.logos */}
                                                {produk.logos && produk.logos.length > 0 && produk.logos[0] && (
                                                  <div className="flex-shrink-0 justify-center">
                                                    {renderImage(produk, 'w-full h-80')}
                                                  </div>
                                                )}
                                                
                                                <div className="flex-1">
                                                  <p className="text-sm text-[#064379] font-medium mb-2">{produk.name}</p>
                                                  {produk.description && (
                                                    <p className="text-[#064379]/80 text-sm leading-relaxed whitespace-pre-line">
                                                      {produk.description}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                          <div className="flex-shrink-0 justify-center">
                            {renderImage(detail, 'w-3/4 h-full')}
                          </div>
                        // </div>
                      )}
                    </div>
                  </div>
                )
              })
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No skin knowledge items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}