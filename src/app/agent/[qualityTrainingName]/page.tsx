"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { BookOpen } from "lucide-react"
import { 
  QualityTrainingHeader, 
  QualityTrainingDescription, 
  QualityTrainingCards, 
  QualityTrainingSection,
  QAAgentHeader,
  QAAgentDescription,
  QAAgentCards,
  QAAgentSection,
  type QualityTraining,
  type JenisQualityTraining,
  createSlug
} from "@/components/agents/quality-training"

export default function QualityTrainingPage() {
  const params = useParams()
  const qualityTrainingName = params.qualityTrainingName as string
  const [qualityTraining, setQualityTraining] = useState<QualityTraining | null>(null)
  const [loading, setLoading] = useState(true)
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

  // Check if qualityTrainingName is "Trainer" or "QA Agent"
  const normalizedName = qualityTrainingName.toLowerCase()
  const isTrainer = normalizedName === 'trainer'
  const isQAAgent = normalizedName === 'qa agent' || normalizedName === 'qa-agent'

  return (
    <div className="min-h-screen my-16">
      {isTrainer && qualityTraining && (
        <>
          {/* Header Section - Trainer */}
          <QualityTrainingHeader 
            qualityTraining={qualityTraining} 
            qualityTrainingName={qualityTrainingName} 
          />

          {/* Description Section - Trainer */}
          <QualityTrainingDescription qualityTraining={qualityTraining} />

          {/* Cards Section - Trainer */}
          <QualityTrainingCards 
            jenisQualityTrainings={sortedJenisQualityTrainings}
            onCardClick={handleCardClick}
          />

          {/* Sections - Trainer */}
          <QualityTrainingSection
            jenisQualityTrainings={sortedJenisQualityTrainings}
            sectionRefs={sectionRefs}
            expandedDetails={expandedDetails}
            toggleDetails={toggleDetails}
          />
        </>
      )}

      {isQAAgent && qualityTraining && (
        <>
          {/* Header Section - QA Agent */}
          <QAAgentHeader 
            qualityTraining={qualityTraining} 
            qualityTrainingName={qualityTrainingName} 
          />

          {/* Description Section - QA Agent */}
          <QAAgentDescription qualityTraining={qualityTraining} />

          {/* Cards Section - QA Agent */}
          <QAAgentCards 
            jenisQualityTrainings={sortedJenisQualityTrainings}
            onCardClick={handleCardClick}
          />

          {/* Sections - QA Agent */}
          <QAAgentSection
            jenisQualityTrainings={sortedJenisQualityTrainings}
            sectionRefs={sectionRefs}
            expandedDetails={expandedDetails}
            toggleDetails={toggleDetails}
          />
        </>
      )}
    </div>
  )
}