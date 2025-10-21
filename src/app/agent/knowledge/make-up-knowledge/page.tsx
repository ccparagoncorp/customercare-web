"use client"

import { useState, useEffect } from "react"
import { Calendar, User, Edit3, FileText, BookOpen, Tag, ChevronUp, ChevronDown, Search, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import makeupContent from "@/content/agent/knowledge/makeup.json"

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

interface MakeupTipDetail {
  id: string
  name: string
  description?: string
  detail?: string
  image?: string
  logos: string[]
}

export default function MakeUpKnowledgePage() {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())

  const content = makeupContent.makeup

  // Get all detail knowledges to display as separate sections
  const allDetailKnowledges = knowledge?.detailKnowledges || []

  // Function to get makeup step order for proper sequencing
  const getMakeupStepOrder = (jenisName: string): number => {
    const name = jenisName.toLowerCase()
    
    // Define the proper makeup application order
    if (name.includes('preparation') || name.includes('skincare')) return 1
    if (name.includes('base make up') || name.includes('foundation') || name.includes('concealer')) return 2
    if (name.includes('eye make up') || name.includes('eyeshadow') || name.includes('eyeliner') || name.includes('mascara')) return 3
    if (name.includes('face decorative') || name.includes('blush') || name.includes('contour') || name.includes('highlighter')) return 4
    if (name.includes('lip make up') || name.includes('lipstick') || name.includes('lip')) return 5
    
    // Default order for unrecognized items
    return 999
  }

  // Function to get design configuration based on detailKnowledge name
  const getDesignConfig = (detailName: string) => {
    const name = detailName.toLowerCase()
    
    if (name.includes('urutan') || name.includes('ber-makeup') || name.includes('preparation') || 
        name.includes('base make up') || name.includes('eye make up') || name.includes('face decorative') || 
        name.includes('lip make up')) {
      return {
        type: 'urutan',
        showImage: true,
        showDescription: true,
        showProducts: true,
        layout: 'horizontal' // image left, content right
      }
    } else if (name.includes('all about shade') || name.includes('eye shadow') || name.includes('blush on')) {
      return {
        type: 'shade',
        showImage: true,
        showDescription: false,
        showProducts: false,
        layout: 'vertical' // image top, title bottom
      }
    } else if (name.includes('make up tips')) {
      return {
        type: 'tips',
        showImage: true,
        showDescription: true,
        showProducts: true,
        showDetails: true, // show jenisDetailKnowledges as details
        layout: 'horizontal'
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
              <div key={index} className="flex items-start gap-4">
                <div className="bg-[#ffde59] text-[#064379] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  {number}
                </div>
                <p className="text-[#064379] leading-relaxed flex-1 text-lg">{content}</p>
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
  const renderImage = (jenis: JenisDetailKnowledge, size: string = 'w-64 h-64') => {
    return (
      <div className={`${size} mx-auto rounded-lg overflow-hidden relative`}>
        {jenis.logos && jenis.logos.length > 0 && jenis.logos[0] ? (
          <>
            <Image
              src={
                jenis.logos[0].startsWith('http') 
                  ? jenis.logos[0] 
                  : jenis.logos[0].startsWith('/') 
                  ? jenis.logos[0] 
                  : jenis.logos[0].startsWith('public/')
                  ? jenis.logos[0].replace('public/', '/')
                  : jenis.logos[0].startsWith('images/')
                  ? `/${jenis.logos[0]}`
                  : `/images/${jenis.logos[0]}`
              }
              alt={jenis.name}
              width={192}
              height={192}
              className="w-full h-full object-cover"
              priority={false}
              unoptimized={true}
              onError={(e) => {
                console.log('Image failed to load:', jenis.logos[0]);
                const target = e.target as HTMLImageElement;
                const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
                if (fallback) {
                  target.style.display = 'none';
                  fallback.classList.remove('hidden');
                  fallback.classList.add('flex', 'items-center', 'justify-center');
                }
              }}
              onLoad={() => console.log('Image loaded successfully:', jenis.logos[0])}
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
      const response = await fetch("/api/knowledge/make-up-knowledge")
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


  // Filter function for search
  const filteredDetailKnowledges = allDetailKnowledges.filter((detail) => {
    if (!searchTerm.trim()) return true
    const searchLower = searchTerm.toLowerCase()
    
    // Search in main detail
    if (
      detail.name.toLowerCase().includes(searchLower) ||
      (detail.description && detail.description.toLowerCase().includes(searchLower)) ||
      (detail.introText && detail.introText.toLowerCase().includes(searchLower))
    ) {
      return true
    }
    
    // Search in jenis detail knowledges
    if (detail.jenisDetailKnowledges && detail.jenisDetailKnowledges.length > 0) {
      return detail.jenisDetailKnowledges.some((jenis) => 
        jenis.name.toLowerCase().includes(searchLower) ||
        (jenis.description && jenis.description.toLowerCase().includes(searchLower)) ||
        (jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.some((produk) =>
          produk.name.toLowerCase().includes(searchLower) ||
          (produk.description && produk.description.toLowerCase().includes(searchLower))
        ))
      )
    }
    
    return false
  })

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
          <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{content.title}</h1>
        </div>
      </div>
      


      <div className="mt-8">
        {/* Information Stats */}
        <div className=" bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-[#064379] mb-6 text-center flex items-center justify-center">
            <BookOpen className="h-6 w-6 mr-3" />
            {content.information.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
              <div className="text-4xl font-bold text-[#064379] mb-2">
                {knowledge.detailKnowledges.length}
              </div>
              <div className="text-sm text-[#064379]/80 font-medium">Total Makeup Knowledge Items</div>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
              <div className="text-4xl font-bold text-[#064379] mb-2">
                {new Date(knowledge.updatedAt || knowledge.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
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

        {/* Search Bar */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-top">
            <div>
              <h2 className="text-3xl font-bold text-[#064379] mb-2 flex items-center">
                <FileText className="h-8 w-8 mr-3" />
                {content.knowledgeDetails.title}
              </h2>
                    {/* Description Section */}
              {content.description && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="max-w-5xl mx-auto">
                    <div className="p-6">
                      <div className="text-left">
                        {formatDescription(content.description)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-[450px]">
              {/* Search Icon */}
              <Search className="absolute left-4 top-1/16 transform -translate-y-1/2 h-5 w-5 text-[#064379] pointer-events-none" />

              <input
                type="text"
                placeholder="Cari makeup knowledge..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 rounded-xl text-[#064379] placeholder-gray-400 focus:ring-2 focus:ring-[#064379]/50 focus:border-[#064379]/50 focus:outline-none border border-gray-300"
              />
              {/* Clear Button */}
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
        </div>

        {/* Main Content - Each detailKnowledge as separate section */}
        <div className="space-y-12 mt-8">
          {filteredDetailKnowledges.length > 0 ? (
            filteredDetailKnowledges.map((detail) => (
              <div key={detail.id} className="rounded-xl shadow-lg overflow-hidden">
                {/* Section Banner Header */}
                <div className="bg-gradient-to-r from-[#064379] to-[#0d0d0e] p-8">
                  <h2 className="text-2xl font-bold text-white text-center">{detail.name}</h2>
                </div>
                
                {/* Section Content */}
                <div className="bg-white/80 backdrop-blur-sm p-8">
                  {(() => {
                    const config = getDesignConfig(detail.name)
                    
                    if (config.type === 'urutan') {
                      // Design for Urutan Ber-Makeup, Preparation, Base Make Up, etc.
                      // Sort jenisDetailKnowledges by proper makeup order
                      const sortedJenisDetailKnowledges = detail.jenisDetailKnowledges 
                        ? [...detail.jenisDetailKnowledges].sort((a, b) => {
                            const orderA = getMakeupStepOrder(a.name)
                            const orderB = getMakeupStepOrder(b.name)
                            return orderA - orderB
                          })
                        : []
                      
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {sortedJenisDetailKnowledges && sortedJenisDetailKnowledges.length > 0 ? (
                            sortedJenisDetailKnowledges.map((jenis, index) => (
                              <div key={jenis.id} className="flex flex-col gap-0 justify-between bg-white rounded-xl p-6 border border-gray-300">
                                <div className="">
                                  {/* Step Number and Header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-[#064379] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">
                                      {getMakeupStepOrder(jenis.name) <= 5 ? getMakeupStepOrder(jenis.name) : index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#064379]">{jenis.name}</h3>
                                  </div>

                                  <div className="flex flex-col gap-4 mb-4">
                                    {/* Image Section */}
                                    {config.showImage && (
                                      <div className="w-full">
                                        {renderImage(jenis, `${detail.name === 'All About Shade' ? 'w-40 h-40' : 'w-64 h-64'}`)}
                                      </div>
                                    )}
                                    
                                    {/* Content Section */}
                                    <div className="w-full">
                                      {config.showDescription && jenis.description && (
                                        <div className="mb-0">
                                          <p className="text-[#064379] leading-relaxed text-md whitespace-pre-line">
                                            {jenis.description}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                  {/* Produk yang dibutuhkan */}
                                  {config.showProducts && jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.length > 0 && (
                                    <div className="mt-0">
                                      {/* Clickable Header */}
                                      <button
                                        onClick={() => toggleProducts(jenis.id)}
                                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                      >
                                        <span className="font-bold text-sm">{jenis.produkJenisDetailKnowledges[0].name}</span>
                                        <div className="flex items-center gap-2">
                                          {expandedProducts.has(jenis.id) ? (
                                            <ChevronUp className="h-4 w-4" />
                                          ) : (
                                            <ChevronDown className="h-4 w-4" />
                                          )}
                                        </div>
                                      </button>
                                      
                                      {/* Products List - Only show when expanded */}
                                      {expandedProducts.has(jenis.id) && (
                                        <div className="mt-6 space-y-4">
                                          {jenis.produkJenisDetailKnowledges.map((produk, produkIndex) => (
                                            <div key={produk.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-6 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                              <div className="flex items-start gap-4">
                                                <div className="flex-1">
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
                            ))
                          ) : (
                            <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                              <div className="text-[#064379]/60">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold mb-2">Belum Ada Data</h3>
                                <p className="text-lg">Belum ada detail informasi yang tersedia untuk section ini.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    } else if (config.type === 'shade') {
                      // Design for All About Shade, Eye Shadow, Blush On - 1 image per row with larger images
                      return (
                        <div className="grid grid-cols-2 gap-8">
                          {detail.jenisDetailKnowledges && detail.jenisDetailKnowledges.length > 0 ? (
                            detail.jenisDetailKnowledges.map((jenis, index) => {
                              const isLastItem = index === detail.jenisDetailKnowledges.length - 1
                              const isOddCount = detail.jenisDetailKnowledges.length % 2 !== 0
                              const shouldSpanFull = isLastItem && isOddCount
                              
                              return (
                                <div 
                                  key={jenis.id} 
                                  className={`bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center ${
                                    shouldSpanFull ? 'col-span-2' : ''
                                  }`}
                                >
                                  <h3 className="text-2xl font-bold mb-4 text-[#064379]">{jenis.name}</h3>
                                  {config.showImage && (
                                    <div className="mb-6">
                                      {renderImage(jenis, 'h-full w-2/3 object-cover rounded-lg')}
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          ) : (
                            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                              <p className="text-[#064379]/60 text-sm italic">
                                Belum ada detail informasi yang tersedia untuk section ini.
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    } else if (config.type === 'tips') {
                      // Design for Make Up Tips
                      return (
                        <div className="space-y-8">
                          {detail.jenisDetailKnowledges && detail.jenisDetailKnowledges.length > 0 ? (
                            detail.jenisDetailKnowledges.map((jenis) => (
                              <div key={jenis.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {config.showImage && (
                                    <div className="flex-shrink-0">
                                      {renderImage(jenis)}
                                    </div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#064379] mb-4">{jenis.name}</h3>
                                    {config.showDescription && jenis.description && (
                                      <div className="mb-6">
                                        <p className="text-[#064379] leading-relaxed whitespace-pre-line">
                                          {jenis.description}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* Detail dari jenisDetailKnowledges jika ada */}
                                    {config.showDetails && jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.length > 0 && (
                                      <div>
                                        <h4 className="text-lg font-bold text-[#064379] mb-4">Detail:</h4>
                                        <div className="space-y-2">
                                          {jenis.produkJenisDetailKnowledges.map((produk, index) => (
                                            <div key={produk.id} className="bg-[#f8fafc] rounded-lg p-3 border-l-4 border-[#064379]">
                                              <p className="text-sm text-[#064379] font-medium">{produk.name}</p>
                                              {produk.description && (
                                                <p className="text-xs text-[#064379]/80 mt-1">{produk.description}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Produk yang dibutuhkan - Clickable Header */}
                                    {config.showProducts && jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.length > 0 && (
                                      <div className="mt-4">
                                        {/* Clickable Header */}
                                        <button
                                          onClick={() => toggleProducts(jenis.id)}
                                          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                          <span className="font-bold text-sm">{jenis.produkJenisDetailKnowledges[0].name}</span>
                                          {/* <span className="font-bold text-sm">Detail</span> */}
                                          <div className="flex items-center gap-2">
                                            {expandedProducts.has(jenis.id) ? (
                                              <ChevronUp className="h-4 w-4" />
                                            ) : (
                                              <ChevronDown className="h-4 w-4" />
                                            )}
                                          </div>
                                        </button>
                                        
                                        {/* Products List - Only show when expanded */}
                                        {expandedProducts.has(jenis.id) && (
                                          <div className="mt-6 space-y-4">
                                            {jenis.produkJenisDetailKnowledges.map((produk, produkIndex) => (
                                              <div key={produk.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-4">
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
                            ))
                          ) : (
                            <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                              <p className="text-[#064379]/60 text-sm italic">
                                Belum ada detail informasi yang tersedia untuk section ini.
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    } else {
                      // Default design
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {detail.jenisDetailKnowledges && detail.jenisDetailKnowledges.length > 0 ? (
                            detail.jenisDetailKnowledges.filter((jenis) => jenis.name !== "Eyeliner").map((jenis) => (
                              <div key={jenis.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex flex-col md:flex-row gap-6">
                                  {config.showImage && (
                                    <div className="flex-shrink-0">
                                      {renderImage(jenis)}
                                    </div>
                                  )}
                                  
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#064379] mb-4">{jenis.name}</h3>
                                    {config.showDescription && jenis.description && (
                                      <p className="text-[#064379] leading-relaxed text-sm whitespace-pre-line">
                                        {jenis.description}
                                      </p>
                                    )}
                                    
                                    {/* Produk yang dibutuhkan - Clickable Header */}
                                    {config.showProducts && jenis.produkJenisDetailKnowledges && jenis.produkJenisDetailKnowledges.length > 0 && (
                                      <div className="mt-4">
                                        {/* Clickable Header */}
                                        <button
                                          onClick={() => toggleProducts(jenis.id)}
                                          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                          {/* <span className="font-bold text-sm">{jenis.produkJenisDetailKnowledges[0].name}</span> */}
                                          <span className="font-bold text-sm">Detail</span>
                                          <div className="flex items-center gap-2">
                                            {expandedProducts.has(jenis.id) ? (
                                              <ChevronUp className="h-4 w-4" />
                                            ) : (
                                              <ChevronDown className="h-4 w-4" />
                                            )}
                                          </div>
                                        </button>
                                        
                                        {/* Products List - Only show when expanded */}
                                        {expandedProducts.has(jenis.id) && (
                                          <div className="mt-6 space-y-4">
                                            {jenis.produkJenisDetailKnowledges.map((produk, produkIndex) => (
                                              <div key={produk.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-start gap-4">
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
                            ))
                          ) : (
                            <div className="col-span-full bg-white rounded-lg p-8 border border-gray-200 text-center">
                              <p className="text-[#064379]/60 text-sm italic">
                                Belum ada detail informasi yang tersedia untuk section ini.
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    }
                  })()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <FileText className="h-16 w-16 text-[#064379]/60 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#064379] mb-4">
                {searchTerm ? "Tidak ditemukan hasil" : content.emptyState.title}
              </h3>
              <p className="text-[#064379]/80 text-lg">
                {searchTerm ? `Tidak ada makeup knowledge yang cocok dengan pencarian "${searchTerm}"` : content.emptyState.description}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-6 py-2 bg-[#064379] text-white rounded-lg hover:bg-[#064379]/80 transition-colors"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          )}
        </div>

        {/* Special Section for filteredDetailKnowledges[-1].jenisDetailKnowledges[-1] - Eyeliner Style Design */}
        {filteredDetailKnowledges.length > 0 && (() => {
          // Get the last detailKnowledge (index [-1])
          const lastDetail = filteredDetailKnowledges[filteredDetailKnowledges.length - 1]
          
          if (!lastDetail || !lastDetail.jenisDetailKnowledges || lastDetail.jenisDetailKnowledges.length === 0) {
            return null
          }
          
          // Get the last jenisDetailKnowledge from the last detail (index [-1])
          // Apply proper sorting for urutan ber-makeup sections
          const sortedJenis = lastDetail.name.toLowerCase().includes('urutan') || lastDetail.name.toLowerCase().includes('ber-makeup') 
            ? [...lastDetail.jenisDetailKnowledges].sort((a, b) => {
                const orderA = getMakeupStepOrder(a.name)
                const orderB = getMakeupStepOrder(b.name)
                return orderA - orderB
              })
            : lastDetail.jenisDetailKnowledges
            
          const lastJenis = sortedJenis[sortedJenis.length - 1]
          
          // Only show if it has produkJenisDetailKnowledges
          if (!lastJenis || !lastJenis.produkJenisDetailKnowledges || lastJenis.produkJenisDetailKnowledges.length === 0) {
            return null
          }

          return (
            <div className="rounded-xl shadow-lg overflow-hidden mt-12 bg-gradient-to-b from-[#041965] to-[#51abae]">
              {/* Header Section - Dark Blue Background */}
              <div className="p-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">{lastJenis.name}</h2>
                <p className="text-white text-lg leading-relaxed max-w-4xl mx-auto">
                  {lastJenis.description}
                </p>
              </div>

              {/* Main Content Section - Light Blue Background */}
              <div className="p-8">
                {lastJenis.produkJenisDetailKnowledges && lastJenis.produkJenisDetailKnowledges.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                    {lastJenis.produkJenisDetailKnowledges.map((produk, index) => (
                      <div key={produk.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Image Section */}
                        <div className="w-full mb-6">
                          {produk.logos && produk.logos.length > 0 && produk.logos[0] ? (
                            <div className="w-full h-48 mx-auto rounded-lg overflow-hidden relative">
                              <Image
                                src={
                                  produk.logos[0].startsWith('http') 
                                    ? produk.logos[0] 
                                    : produk.logos[0].startsWith('/') 
                                    ? produk.logos[0] 
                                    : produk.logos[0].startsWith('public/')
                                    ? produk.logos[0].replace('public/', '/')
                                    : produk.logos[0].startsWith('images/')
                                    ? `/${produk.logos[0]}`
                                    : `/images/${produk.logos[0]}`
                                }
                                alt={produk.name}
                                width={180}
                                height={180}
                                className="w-full h-full object-cover p-4"
                                priority={false}
                                unoptimized={true}
                                onError={(e) => {
                                  console.log('Image failed to load:', produk.logos[0]);
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
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">No Image</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="text-center flex justify-between flex-col">
                          <h3 className="text-xl font-bold text-[#064379] mb-2">{produk.name}</h3>
                          {produk.description && (
                            <p className="text-[#064379] leading-relaxed text-sm">
                              {produk.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                    <div className="text-[#064379]/60">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold mb-2">Belum Ada Detail</h3>
                      <p className="text-lg">Belum ada detail informasi yang tersedia untuk section ini.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}


