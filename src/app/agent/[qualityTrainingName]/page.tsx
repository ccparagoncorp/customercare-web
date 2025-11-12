"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Edit3, FileText, BookOpen, ChevronUp, ChevronDown, Search, Image as ImageIcon, ExternalLink, Check, X, ChevronRight, ClipboardList } from "lucide-react"
import { TracerButton } from "@/components/agents/TracerButton"

interface QualityTraining {
  id: string
  title: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
  updateNotes?: string
  jenisQualityTrainings: JenisQualityTraining[]
}

interface JenisQualityTraining {
  id: string
  name: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  qualityTrainingId: string
  detailQualityTrainings: DetailQualityTraining[]
}

interface DetailQualityTraining {
  id: string
  name: string
  description?: string
  linkslide?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  jenisQualityTrainingId: string
  subdetailQualityTrainings: SubdetailQualityTraining[]
}

interface SubdetailQualityTraining {
  id: string
  name: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  detailQualityTrainingId: string
}

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export default function QualityTrainingPage() {
  const params = useParams()
  const qualityTrainingName = params.qualityTrainingName as string
  const [qualityTraining, setQualityTraining] = useState<QualityTraining | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const isScrollingRef = useRef(false) // Flag to prevent loop between scroll and hash update
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Sort jenisQualityTrainings by createdAt
  const sortedJenisQualityTrainings = useMemo(() => {
    return qualityTraining?.jenisQualityTrainings
      ? [...qualityTraining.jenisQualityTrainings].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      : []
  }, [qualityTraining?.jenisQualityTrainings])

  const fetchQualityTraining = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quality-training/${encodeURIComponent(qualityTrainingName)}`)
      if (response.ok) {
        const data = await response.json()
        setQualityTraining(data)
      }
    } catch (error) {
      console.error("Error fetching quality training:", error)
    } finally {
      setLoading(false)
    }
  }, [qualityTrainingName])

  useEffect(() => {
    fetchQualityTraining()
  }, [fetchQualityTraining])

  // Handle hash navigation and scroll to section
  useEffect(() => {
    if (!qualityTraining || sortedJenisQualityTrainings.length === 0) return

    const hash = window.location.hash.slice(1) // Remove #
    if (hash) {
      // Find matching jenisQualityTraining by slug
      const matchingJenis = sortedJenisQualityTrainings.find(jenis => 
        createSlug(jenis.name) === hash.toLowerCase()
      )
      
      if (matchingJenis && sectionRefs.current[matchingJenis.id]) {
        isScrollingRef.current = true // Set flag to prevent observer from updating hash
        setTimeout(() => {
          sectionRefs.current[matchingJenis.id]?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
          // Reset flag after scroll animation completes
          setTimeout(() => {
            isScrollingRef.current = false
          }, 1000)
        }, 300) // Small delay to ensure DOM is ready
      }
    }
  }, [qualityTraining, sortedJenisQualityTrainings])

  // Setup Intersection Observer for auto-updating URL hash on scroll
  useEffect(() => {
    if (!qualityTraining || sortedJenisQualityTrainings.length === 0) return

    // Wait for DOM to be ready
    const setupObserver = () => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // Create new Intersection Observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Don't update hash if we're programmatically scrolling
          if (isScrollingRef.current) return

          // Find the entry with the highest intersection ratio that's visible
          const visibleEntries = entries.filter(entry => entry.isIntersecting)
          if (visibleEntries.length === 0) return

          // Sort by intersection ratio (highest first) and then by position (topmost first)
          visibleEntries.sort((a, b) => {
            if (b.intersectionRatio !== a.intersectionRatio) {
              return b.intersectionRatio - a.intersectionRatio
            }
            const aTop = a.boundingClientRect.top
            const bTop = b.boundingClientRect.top
            return aTop - bTop
          })

          const mostVisible = visibleEntries[0]
          if (!mostVisible.isIntersecting) return

          // Get the section ID from the element
          const sectionElement = mostVisible.target as HTMLElement
          const sectionId = sectionElement.id

          // Only update if hash is different
          if (window.location.hash.slice(1) !== sectionId) {
            // Update URL hash without triggering scroll
            window.history.replaceState(null, '', `#${sectionId}`)
          }
        },
        {
          root: null,
          rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the top 40% of viewport
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      )

      // Observe all sections
      sortedJenisQualityTrainings.forEach((jenis) => {
        const sectionId = createSlug(jenis.name)
        const element = document.getElementById(sectionId)
        if (element && observerRef.current) {
          observerRef.current.observe(element)
        }
      })
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 500)

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [qualityTraining, sortedJenisQualityTrainings])

  const toggleDetails = (detailId: string) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev)
      if (newSet.has(detailId)) {
        newSet.delete(detailId)
      } else {
        newSet.add(detailId)
      }
      return newSet
    })
  }

  const handleCardClick = (jenis: JenisQualityTraining) => {
    const slug = createSlug(jenis.name)
    // Update hash without triggering navigation
    window.history.pushState(null, '', `#${slug}`)
    
    // Set flag to prevent observer from updating hash during scroll
    isScrollingRef.current = true
    
    // Scroll to section
    setTimeout(() => {
      if (sectionRefs.current[jenis.id]) {
        sectionRefs.current[jenis.id]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        // Reset flag after scroll animation completes
        setTimeout(() => {
          isScrollingRef.current = false
        }, 1000)
      }
    }, 100)
  }

  // Filter jenisQualityTrainings based on search
  const filteredJenisQualityTrainings = sortedJenisQualityTrainings.filter(jenis => {
    if (!searchTerm.trim()) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      jenis.name.toLowerCase().includes(searchLower) ||
      jenis.description?.toLowerCase().includes(searchLower) ||
      false
    )
  })

  // Function to get design configuration based on Jenis name
  const getJenisDesignConfig = (jenisName: string) => {
    const name = jenisName.toLowerCase().trim()
    
    if (name.includes('quality of services') || name === 'quality of services') {
      return {
        type: 'quality-of-services',
        layout: 'split-two-columns', // Left-right split for 2 details
        showIcons: true, // Show check/x icons
      }
    }

    else if (name.includes('sop pelaporan eskos') || name === 'sop pelaporan eskos') {
      return {
        type: 'sop-pelaporan-eskos',
        layout: 'vertical', // Stack vertically
        showIcons: false,
      }
    }
    else if (
      name.includes('tips') && (name.includes('tricks') || name.includes('trick')) && (name.includes('customer') || name.includes('cs'))
    ) {
      return {
        type: 'tips-tricks-customer-services',
        layout: 'card-grid', // Display as cards in grid
        showIcons: false,
      }
    }
    else if (name.includes('all-materi-training') || name.includes('all materi training')) {
      return {
        type: 'all-materi-training',
        layout: 'slides-grid',
        showIcons: false,
      }
    }
    else if (
      name.includes('behaviour-customer-service') || 
      name.includes('behaviour customer service') || 
      name.includes('behavior-customer-service') || 
      name.includes('behavior customer service') ||
      name.includes('behaviour-customer-care') || 
      name.includes('behaviour customer care') || 
      name.includes('behavior-customer-care') || 
      name.includes('behavior customer care') ||
      (name.includes('behaviour') && name.includes('customer') && (name.includes('service') || name.includes('care'))) ||
      (name.includes('behavior') && name.includes('customer') && (name.includes('service') || name.includes('care')))
    ) {
      return {
        type: 'behaviour-customer-service',
        layout: 'card-grid',
        showIcons: false,
      }
    }
    else if (name.includes('faq') || name === 'faq' || name.includes('frequently asked questions')) {
      return {
        type: 'faq',
        layout: 'faq-list',
        showIcons: false,
      }
    }
    
    // Default design
    return {
      type: 'default',
      layout: 'vertical', // Stack vertically
      showIcons: false,
    }
  }

  // Function to render image with fallback
  const renderImage = (item: { logos: string[] }, size: string = 'w-64 h-64') => {
    const logos = item.logos && item.logos.length > 0 ? item.logos[0] : null
    
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
              alt="Quality Training"
              width={256}
              height={256}
              className="w-full h-full object-cover"
              priority={false}
              unoptimized={true}
              onError={(e) => {
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

  // Function to convert slide/share links to embeddable URL (Google Slides basic support)
  const getSlideEmbedUrl = (url: string): string => {
    try {
      const u = url.trim()
      // Pattern 1: https://docs.google.com/presentation/d/{id}/edit...
      const m1 = u.match(/https?:\/\/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/)
      if (m1 && m1[1]) {
        return `https://docs.google.com/presentation/d/${m1[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`
      }
      // Pattern 2: https://docs.google.com/presentation/d/e/{id}/pub?... or /embed
      const m2 = u.match(/https?:\/\/docs\.google\.com\/presentation\/d\/e\/([a-zA-Z0-9_-]+)/)
      if (m2 && m2[1]) {
        return `https://docs.google.com/presentation/d/e/${m2[1]}/embed?start=false&loop=false&delayms=3000&rm=minimal`
      }
      // Google Drive preview links
      const mDrive = u.match(/https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (mDrive && mDrive[1]) {
        return `https://drive.google.com/file/d/${mDrive[1]}/preview`
      }
      // Fallback: return original (browser may still embed)
      return u
    } catch {
      return url
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064379] to-[#0d0d0e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffde59] mx-auto mb-4"></div>
          <p className="text-[#b2fcff]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!qualityTraining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#064379] to-[#0d0d0e] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-[#ffde59] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#b2fcff] mb-2">Quality Training Not Found</h2>
          <p className="text-[#b2fcff]">The requested quality training could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen my-16">
      {/* Header Section */}
      <div className="bg-[repeating-linear-gradient(135deg,#23519c_0%,#398dff_25%,#23519c_50%)] rounded-3xl px-4 sm:px-6 lg:px-8 py-8 mx-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[#ffde59] mb-4">{qualityTraining.title}</h1>
        </div>
        <div className="flex justify-center mt-6">
          <TracerButton href={`/agent/${qualityTrainingName}/tracer`} className="" />
        </div>
      </div>

      {/* Information Stats */}
      {/* <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mx-24">
        <h3 className="text-2xl font-bold text-[#064379] mb-6 text-center flex items-center justify-center">
          <BookOpen className="h-6 w-6 mr-3" />
          Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
            <div className="text-4xl font-bold text-[#064379] mb-2">
              {qualityTraining.jenisQualityTrainings.length}
            </div>
            <div className="text-sm text-[#064379]/80 font-medium">Total Training Types</div>
          </div> */}

          {/* <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20">
            <div className="text-4xl font-bold text-[#064379] mb-2">
              {(() => {
                const date = new Date(qualityTraining.updatedAt || qualityTraining.createdAt);
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
              {qualityTraining.updatedAt ? "Last Updated" : "Created On"}
            </div>
          </div> */}

          {/* <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20 mx-24">
            <div className="text-4xl font-bold text-[#064379] mb-2">
              {qualityTraining.updatedBy || qualityTraining.createdBy || "System"}
            </div>
            <div className="text-sm text-[#064379]/80 font-medium">
              {qualityTraining.updatedBy ? "Updated By" : "Created By"}
            </div>
          </div>
        </div> */}

        {/* Update Notes */}
        {/* {qualityTraining.updateNotes && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#064379]/20 mx-24">
            <h4 className="text-lg font-bold text-[#064379] mb-3 flex items-center">
              <Edit3 className="h-5 w-5 mr-2" />
              Update Notes
            </h4>
            <p className="text-[#064379]/90 leading-relaxed">{qualityTraining.updateNotes}</p>
          </div>
        )}
      </div> */}

      {/* Description Section */}
      {qualityTraining.description && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-8 mx-24">
          <h2 className="text-3xl font-bold text-[#064379] mb-4 flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            Description
          </h2>
          <div className="text-[#064379]/90 leading-relaxed text-lg">
            {qualityTraining.description}
          </div>
        </div>
      )}

      {/* Search Bar */}
      {/* <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 p-6 mx-24">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#064379]/50" />
          <input
            type="text"
            placeholder="Search training types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#064379]/20 focus:outline-none focus:ring-2 focus:ring-[#064379] text-[#064379]"
          />
        </div>
      </div> */}

      {/* Cards Section - JenisQualityTraining Cards */}
      <div className="mt-8 mx-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJenisQualityTrainings.map((jenis, index) => (
            <div
              key={jenis.id}
              onClick={() => handleCardClick(jenis)}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-[#0259b7] overflow-hidden transform hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0259b7]/0 via-[#017cff]/0 to-[#23519c]/0 group-hover:from-[#0259b7]/10 group-hover:via-[#017cff]/10 group-hover:to-[#23519c]/10 transition-all duration-500" />
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0259b7]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-br from-[#0259b7] to-[#017cff] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0259b7] group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors mb-3 line-clamp-2">
                  {jenis.name}
                </h3>
                
                {/* Description */}
                {jenis.description && (
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {jenis.description}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-[#0259b7]/20 transition-colors">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-[#0259b7]" />
                    <span className="font-semibold text-gray-700">{jenis.detailQualityTrainings.length}</span>
                    <span className="text-gray-500">
                      {jenis.detailQualityTrainings.length !== 1 ? 'Details' : 'Detail'}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-[#0259b7]/10 to-[#017cff]/10 rounded-full">
                    <span className="text-xs font-medium text-[#0259b7]">View</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections - Each JenisQualityTraining as a section */}
      <div className="mt-24 space-y-0">
        {sortedJenisQualityTrainings.map((jenis) => {
          const sectionId = createSlug(jenis.name)
          const designConfig = getJenisDesignConfig(jenis.name)
          
          // Debug log (can be removed later)
          if (jenis.name.toLowerCase().includes('tips')) {
            console.log('Jenis name:', jenis.name, 'Design config:', designConfig)
          }
          if (jenis.name.toLowerCase().includes('behaviour') || jenis.name.toLowerCase().includes('behavior')) {
            console.log('Behaviour/Customer Service - Jenis name:', jenis.name, 'Design config:', designConfig)
          }
          
          // Determine section wrapper classes based on design config
          const getSectionWrapperClasses = () => {
            if (designConfig.type === 'quality-of-services') {
              return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]"
            }
            if (designConfig.type === 'tips-tricks-customer-services') {
              return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-[#fef3c7] to-[#fde68a]"
            }
            if (designConfig.type === 'behaviour-customer-service') {
              return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe]"
            }
            if (designConfig.type === 'faq') {
              return "overflow-hidden scroll-mt-20 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]"
            }
            return "overflow-hidden scroll-mt-20"
          }

          // Determine section header classes based on design config
          const getSectionHeaderClasses = () => {
            if (designConfig.type === 'quality-of-services') {
              return "bg-gradient-to-r from-[#0d4190] to-[#58d1e6] p-4 pt-24"
            }
            if (designConfig.type === 'tips-tricks-customer-services') {
              return "bg-[#d6e5ff] p-4 pt-24"
            }
            if (designConfig.type === 'behaviour-customer-service') {
              return "bg-[#064379] p-4 pt-24"
            }
            if (designConfig.type === 'all-materi-training') {
              return "bg-gradient-to-r from-[#064379] to-[#0d0d0e] px-0 py-4 pt-24"
            }
            if (designConfig.type === 'faq') {
              return "bg-[#064379] p-4 pt-24"
            }
            return "bg-gradient-to-r from-[#064379] to-[#0d0d0e] p-4 pb-12 pt-24"
          }

          // Determine section content classes based on design config
          const getSectionContentClasses = () => {
            if (designConfig.type === 'quality-of-services') {
              return "bg-gradient-to-r from-[#0d4190] to-[#58d1e6] p-4 pb-32"
            }
            if (designConfig.type === 'sop-pelaporan-eskos') {
              return "bg-gradient-to-r from-[#064379] to-[#0d0d0e] p-4 pb-0"
            }
            if (designConfig.type === 'all-materi-training') {
              return "p-0"
            }
            if (designConfig.type === 'tips-tricks-customer-services') {
              return "bg-[#d6e5ff] p-8 pb-32"
            }
            if (designConfig.type === 'behaviour-customer-service') {
              return "bg-gradient-to-b from-[#064379] to-[#0d0d0e] p-8 pb-32"
            }
            if (designConfig.type === 'faq') {
              return "bg-gradient-to-b from-[#064379] to-[#0d0d0e] p-8 pb-32"
            }
            return "bg-white/80 backdrop-blur-sm p-4 pb-24"
          }

          return (
            <div
              key={jenis.id}
              id={sectionId}
              ref={(el) => {
                sectionRefs.current[jenis.id] = el
              }}
              className={getSectionWrapperClasses()}
            >
              {/* Section Banner Header */}
              <div className={getSectionHeaderClasses()}>
                <h2 className={
                  designConfig.type === 'tips-tricks-customer-services' 
                    ? 'text-6xl font-extrabold text-[#064379] text-center' 
                    : 'text-6xl font-extrabold text-white text-center'
                }>{jenis.name}</h2>
                {jenis.description && (
                  <p className="text-white/80 text-center mt-2">{jenis.description}</p>
                )}
              </div>

              {/* Section Content */}
              <div className={getSectionContentClasses()}>
                {(() => {
                  // SOP Pelaporan Eskos - Display logos (check first, doesn't need detailQualityTrainings)
                  if (designConfig.type === 'sop-pelaporan-eskos') {
                    return (
                      <div className="flex flex-wrap justify-center items-center gap-8">
                        {jenis.logos && jenis.logos.length > 0 ? (
                          jenis.logos.map((logo, logoIndex) => (
                            <div key={logoIndex} className="flex items-center justify-center">
                              {renderImage({ logos: [logo] }, 'w-full h-auto')}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-white/80">
                            No logos available
                          </div>
                        )}
                      </div>
                    )
                  }

                  // Tips & Tricks Customer Services - Centered cards using flex
                  if (designConfig.type === 'tips-tricks-customer-services' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
                    return (
                      <div className="flex flex-wrap justify-center gap-6">
                        {jenis.detailQualityTrainings.map((detail) => (
                          <div
                            key={detail.id}
                            className="bg-gradient-to-b from-[#041965] to-[#51abae] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-[#041965] transform hover:-translate-y-1 w-full md:w-[calc(50%-1rem)] lg:w-[calc(20%-1.25rem)] max-w-sm"
                          >
                            <div className="flex flex-col items-center justify-center gap-3 mb-4">
                              {detail.logos && detail.logos[0] && (
                                <Image src={detail.logos[0]} alt={detail.name} width={200} height={200} />
                              )}
                              <h3 className="text-xl text-center font-bold text-white mb-2 line-clamp-2">
                                {detail.name}
                              </h3>
                            </div>
                            {detail.description && (
                              <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-line">
                                {detail.description}
                              </p>
                            )}
                            {detail.linkslide && (
                              <a
                                href={detail.linkslide}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-lg hover:from-[#d97706] hover:to-[#b45309] transition-colors text-sm font-medium"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>Open Slide</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  }

                  // Behaviour Customer Care - Modern card grid layout
                  if (designConfig.type === 'behaviour-customer-service' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
                    return (
                      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
                        {jenis.detailQualityTrainings.map((detail) => (
                          <div
                            key={detail.id}
                            className="group bg-gradient-to-r from-[#51abae] to-[#041965] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#ffde59] transform hover:-translate-y-2"
                          >
                            {/* Image Section */}
                            {detail.logos && detail.logos[0] && (
                              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]">
                                <Image 
                                  src={detail.logos[0]} 
                                  alt={detail.name} 
                                  width={400} 
                                  height={200}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            )}
                            
                            {/* Content Section */}
                            <div className="p-6">
                              <div className="flex items-center">
                                <div className="w-1/6 items-center justify-center text-center">
                                  <h3 className="text-9xl font-black text-[#ffde59] mb-3 line-clamp-2 group-hover:text-[#ffde59] transition-colors">
                                    {detail.name[0]}
                                  </h3>
                                </div>
                                <div>
                                  <h3 className="text-3xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#ffde59] transition-colors">
                                    {detail.name}
                                  </h3>
                                  
                                  {detail.description && (
                                    <p className="text-white text-lg leading-relaxed mb-4 whitespace-pre-line line-clamp-4">
                                      {detail.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Subdetails */}
                              {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => toggleDetails(detail.id)}
                                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                  >
                                    <span className="font-bold text-sm">View Details ({detail.subdetailQualityTrainings.length})</span>
                                    <div className="flex items-center gap-2">
                                      {expandedDetails.has(detail.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </div>
                                  </button>
                                  
                                  {expandedDetails.has(detail.id) && (
                                    <div className="mt-4 space-y-3">
                                      {detail.subdetailQualityTrainings.map((subdetail) => (
                                        <div key={subdetail.id} className="bg-gradient-to-r from-[#f0f4ff] to-[#e8f0fe] rounded-lg p-4 border-l-4 border-[#4f46e5] shadow-sm hover:shadow-md transition-shadow">
                                          <div className="flex items-start gap-4">
                                            {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                              <div className="flex-shrink-0">
                                                {renderImage(subdetail, 'w-24 h-24')}
                                              </div>
                                            )}
                                            <div className="flex-1">
                                              <p className="text-sm text-[#4f46e5] font-medium mb-2">{subdetail.name}</p>
                                              {subdetail.description && (
                                                <p className="text-[#4f46e5]/80 text-sm leading-relaxed whitespace-pre-line">
                                                  {subdetail.description}
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
                              
                              {/* Link Slide */}
                              {detail.linkslide && (
                                <a
                                  href={detail.linkslide}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white rounded-lg hover:from-[#4338ca] hover:to-[#6d28d9] transition-colors text-sm font-medium w-full justify-center"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span>Open Slide</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }

                  // All Materi Training - Slides only, 2-column grid with pair coloring
                  if ((designConfig.type === 'all-materi-training') && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
                    const slideDetails = jenis.detailQualityTrainings.filter(d => !!d.linkslide)
                    const pairs: DetailQualityTraining[][] = []
                    for (let i = 0; i < slideDetails.length; i += 2) {
                      pairs.push(slideDetails.slice(i, i + 2))
                    }
                    const pairThemes = [
                      { wrapper: 'from-[#064379] to-[#0d0d0e]', badge: 'from-[#f59e0b] to-[#d97706]' },
                      { wrapper: 'from-[#51abae] to-[#041965]', badge: 'from-[#6366f1] to-[#4338ca]' },
                    ]
                    return (
                      <div className="w-full">
                        {pairs.map((pair, pairIndex) => {
                          const theme = pairThemes[pairIndex % pairThemes.length]
                          const isLastPairWithOneItem = pairIndex === pairs.length - 1 && pair.length === 1
                          return (
                            <div key={pairIndex} className={`w-full bg-gradient-to-r ${theme.wrapper}`}>
                              <div className="p-16 px-48">
                                <div className={`grid gap-6 ${isLastPairWithOneItem ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                              {pair.map((d) => (
                                <div key={d.id} className={isLastPairWithOneItem ? 'w-full' : ''}>
                                  <div className={`rounded-2xl border border-white/20 shadow-lg overflow-hidden bg-gradient-to-b ${theme.wrapper}`}>
                                    <h4 className="text-white font-bold text-3xl justify-center text-center my-4">{d.name}</h4>

                                    {/* Responsive 16:9 iframe using padding-bottom hack for broader support */}
                                    <div className="relative w-full pb-[56.25%]">
                                      <iframe
                                        src={getSlideEmbedUrl(d.linkslide as string)}
                                        className="absolute inset-0 w-full h-full border-0 rounded-b-2xl p-4 bg-white"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        loading="lazy"
                                      />
                                      <div className="p-4 flex items-center justify-between absolute top-2 right-2">
                                        <a
                                          href={d.linkslide as string}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white text-white text-xs bg-[#064379d2] hover:bg-[#025ab783] transition-colors"
                                        >
                                          <ExternalLink className="h-3 w-3 " /> <span className="text-sm font-bold">Open</span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }

                  // Quality of Services and other types that need detailQualityTrainings
                  if (jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
                    // Quality of Services - Split two columns layout
                    if (designConfig.type === 'quality-of-services' && designConfig.layout === 'split-two-columns' && jenis.detailQualityTrainings.length === 2) {
                      const [firstDetail, secondDetail] = jenis.detailQualityTrainings
                        return (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-10 items-stretch">
                           <div className="flex flex-col">
                               <div className="flex items-center justify-center gap-3 mb-4">
                                 <Check className="h-10 w-10 text-white bg-green-600 rounded-full flex-shrink-0 p-1" />
                                 <h3 className="text-4xl font-black text-white">{firstDetail.name}</h3>
                               </div>
 
                             {/* First Detail - Do's (with Check icon) */}
                             <div className="bg-white rounded-lg p-6 px-12 shadow-sm border border-gray-200 flex-1 flex flex-col">
                              <div>
                                {firstDetail.description && (
                                  <p className="text-[#064379] text-lg font-bold leading-10 whitespace-pre-line">
                                    {firstDetail.description}
                                  </p>
                                )}
                                {firstDetail.linkslide && (
                                  <a
                                    href={firstDetail.linkslide}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#064379] text-white rounded-lg hover:bg-[#0259b7] transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="text-sm">Open Slide</span>
                                  </a>
                                )}
                                {/* SubdetailQualityTrainings for first detail */}
                                {firstDetail.subdetailQualityTrainings && firstDetail.subdetailQualityTrainings.length > 0 && (
                                  <div className="mt-4">
                                    <button
                                      onClick={() => toggleDetails(firstDetail.id)}
                                      className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                      <span className="font-bold text-sm">View Subdetails</span>
                                      <div className="flex items-center gap-2">
                                        {expandedDetails.has(firstDetail.id) ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </div>
                                    </button>
                                    {expandedDetails.has(firstDetail.id) && (
                                      <div className="mt-6 space-y-4">
                                        {firstDetail.subdetailQualityTrainings.map((subdetail) => (
                                          <div key={subdetail.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                              {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                                <div className="flex-shrink-0">
                                                  {renderImage(subdetail, 'w-32 h-32')}
                                                </div>
                                              )}
                                              <div className="flex-1">
                                                <p className="text-sm text-[#064379] font-medium mb-2">{subdetail.name}</p>
                                                {subdetail.description && (
                                                  <p className="text-[#064379]/80 text-sm leading-relaxed whitespace-pre-line">
                                                    {subdetail.description}
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

                           {/* Second Detail - Don'ts (with X icon) */}
                           <div className="flex flex-col">
                             <div className="flex items-center justify-center gap-3 mb-4">
                                 <X className="h-10 w-10 text-white bg-red-600 rounded-full flex-shrink-0 p-1" />
                                 <h3 className="text-4xl font-black text-white">{secondDetail.name}</h3>
                               </div>
                             
                             <div className="bg-white rounded-lg p-6 px-12 shadow-sm border border-gray-200 flex-1 flex flex-col">
                              {secondDetail.description && (
                                <p className="text-[#064379] text-lg font-bold leading-10 whitespace-pre-line">
                                  {secondDetail.description}
                                </p>
                              )}
                              {secondDetail.linkslide && (
                                <a
                                  href={secondDetail.linkslide}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#064379] text-white rounded-lg hover:bg-[#0259b7] transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="text-sm">Open Slide</span>
                                </a>
                              )}
                              {/* SubdetailQualityTrainings for second detail */}
                              {secondDetail.subdetailQualityTrainings && secondDetail.subdetailQualityTrainings.length > 0 && (
                                <div className="mt-4">
                                  <button
                                    onClick={() => toggleDetails(secondDetail.id)}
                                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                  >
                                    <span className="font-bold text-sm">View Subdetails</span>
                                    <div className="flex items-center gap-2">
                                      {expandedDetails.has(secondDetail.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </div>
                                  </button>
                                  {expandedDetails.has(secondDetail.id) && (
                                    <div className="mt-6 space-y-4">
                                      {secondDetail.subdetailQualityTrainings.map((subdetail) => (
                                        <div key={subdetail.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                          <div className="flex items-start gap-4">
                                            {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                              <div className="flex-shrink-0">
                                                {renderImage(subdetail, 'w-32 h-32')}
                                              </div>
                                            )}
                                            <div className="flex-1">
                                              <p className="text-sm text-[#064379] font-medium mb-2">{subdetail.name}</p>
                                              {subdetail.description && (
                                                <p className="text-[#064379]/80 text-sm leading-relaxed whitespace-pre-line">
                                                  {subdetail.description}
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
                    )
                  }

                  // FAQ Layout - List with expandable descriptions
                  if (designConfig.type === 'faq' && jenis.detailQualityTrainings && jenis.detailQualityTrainings.length > 0) {
                    return (
                      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {jenis.detailQualityTrainings.map((detail, index) => (
                          <div
                            key={detail.id}
                            className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                          >
                            {/* Question Header - Always Visible */}
                            <button
                              onClick={() => toggleDetails(detail.id)}
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="flex items-start gap-4 flex-1">
                                <h3 className="text-lg font-black text-[#064379] flex-1">
                                  {detail.name}
                                </h3>
                              </div>
                              <div className="flex-shrink-0 ml-4 items-end justify-end">
                                {expandedDetails.has(detail.id) ? (
                                  <ChevronUp className="w-8 h-8 text-[#064379]" />
                                ) : (
                                  <ChevronDown className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                            </button>

                            {/* Answer/Description - Expandable */}
                            {expandedDetails.has(detail.id) && (
                              <div className="pb-6 pt-0 mx-6 border-t-2 border-[#064379] animate-fade-in">
                                <div className="pt-4">
                                  {detail.description && (
                                    <p className="text-[#064379] leading-relaxed whitespace-pre-line mb-4">
                                      {detail.description}
                                    </p>
                                  )}
                                  
                                  {/* Link Slide if available */}
                                  {detail.linkslide && (
                                    <a
                                      href={detail.linkslide}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white rounded-lg hover:from-[#014a9a] hover:to-[#0166d6] transition-colors text-sm font-medium shadow-sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span>Open Slide</span>
                                    </a>
                                  )}

                                  {/* Images if available */}
                                  {detail.logos && detail.logos.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {detail.logos.map((logo, logoIndex) => (
                                        <div key={logoIndex} className="relative rounded-lg overflow-hidden border border-gray-200">
                                          {renderImage({ logos: [logo] }, 'w-full h-48')}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* SubdetailQualityTrainings if available */}
                                  {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                      {detail.subdetailQualityTrainings.map((subdetail) => (
                                        <div
                                          key={subdetail.id}
                                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-[#0259b7]"
                                        >
                                          <div className="flex items-start gap-3">
                                            {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                              <div className="flex-shrink-0">
                                                {renderImage(subdetail, 'w-20 h-20')}
                                              </div>
                                            )}
                                            <div className="flex-1">
                                              <p className="text-sm font-semibold text-[#0259b7] mb-1">
                                                {subdetail.name}
                                              </p>
                                              {subdetail.description && (
                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                                  {subdetail.description}
                                                </p>
                                              )}
                                            </div>
                                          </div>
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
                    )
                  }
                    
                    // Default layout - vertical stack
                    return (
                      <div className="space-y-6">
                        {jenis.detailQualityTrainings.map((detail) => (
                          <div key={detail.id} className="bg-white p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-[#064379] mb-2">{detail.name}</h3>
                                {detail.description && (
                                  <p className="text-[#064379]/80 text-sm leading-relaxed whitespace-pre-line">
                                    {detail.description}
                                  </p>
                                )}
                              </div>
                              {detail.linkslide && (
                                <a
                                  href={detail.linkslide}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#064379] text-white rounded-lg hover:bg-[#0259b7] transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="text-sm">Open Slide</span>
                                </a>
                              )}
                            </div>

                            {/* SubdetailQualityTrainings */}
                            {detail.subdetailQualityTrainings && detail.subdetailQualityTrainings.length > 0 && (
                              <div className="mt-4">
                                <button
                                  onClick={() => toggleDetails(detail.id)}
                                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#064379] to-[#0259b7] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                  <span className="font-bold text-sm">View Subdetails</span>
                                  <div className="flex items-center gap-2">
                                    {expandedDetails.has(detail.id) ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </div>
                                </button>

                                {expandedDetails.has(detail.id) && (
                                  <div className="mt-6 space-y-4">
                                    {detail.subdetailQualityTrainings.map((subdetail) => (
                                      <div key={subdetail.id} className="bg-gradient-to-r from-[#f8fafc] to-[#e8f4fd] rounded-lg p-4 border-l-4 border-[#064379] shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                          {subdetail.logos && subdetail.logos.length > 0 && subdetail.logos[0] && (
                                            <div className="flex-shrink-0">
                                              {renderImage(subdetail, 'w-32 h-32')}
                                            </div>
                                          )}
                                          <div className="flex-1">
                                            <p className="text-sm text-[#064379] font-medium mb-2">{subdetail.name}</p>
                                            {subdetail.description && (
                                              <p className="text-[#064379]/80 text-sm leading-relaxed whitespace-pre-line">
                                                {subdetail.description}
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
                        ))}
                      </div>
                    )
                  }

                  // If no detailQualityTrainings and not sop-pelaporan-eskos
                  return (
                    <div className="text-center py-8 text-[#064379]/60">
                      No details available for this training type
                    </div>
                  )
                })()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}