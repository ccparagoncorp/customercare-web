"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QualityTraining {
  id: string
  title: string
  description?: string
  createdAt: string
  slug: string
}

interface QualityTrainingSubmenuProps {
  isHovered: boolean
  isActive?: boolean // Made optional, will be calculated internally
}

export function QualityTrainingSubmenu({ isHovered, isActive: externalIsActive }: QualityTrainingSubmenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [qualityTrainings, setQualityTrainings] = useState<QualityTraining[]>([])
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  // Fetch quality training data on mount to check active state
  useEffect(() => {
    fetchQualityTrainings()
  }, [])

  // Close submenu when sidebar is not hovered
  useEffect(() => {
    if (!isHovered) {
      setIsExpanded(false)
    }
  }, [isHovered])

  const fetchQualityTrainings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quality-training')
      if (response.ok) {
        const data = await response.json()
        setQualityTrainings(data)
      }
    } catch (error) {
      console.error('Error fetching quality trainings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Function to check if a quality training item is active based on current pathname
  const isQualityTrainingItemActive = (qualityTraining: QualityTraining): boolean => {
    const slug = qualityTraining.title.toLowerCase().trim().replace(/ /g, '-')
    const qualityTrainingPath = `/agent/${slug}`
    // Check if pathname matches (hash is not included in pathname, so we just check the base path)
    return pathname === qualityTrainingPath
  }

  // Calculate if Quality & Training menu itself is active
  // It's active only if pathname matches exactly one of the quality training paths
  const isMenuActive = qualityTrainings.some(qt => {
    const slug = qt.title.toLowerCase().trim().replace(/ /g, '-')
    const qualityTrainingPath = `/agent/${slug}`
    return pathname === qualityTrainingPath
  })

  // Use calculated active state or external one if provided
  const isActive = externalIsActive !== undefined ? externalIsActive : isMenuActive

  return (
    <div className="space-y-1 relative">
      {/* Main Quality & Training Item */}
      <div
        onClick={handleToggle}
        className={`flex items-center rounded-xl transition-all duration-200 group relative px-4 py-3 cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white shadow-lg shadow-[#0259b7]/20'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#0259b7] hover:shadow-md'
        }`}
      >
        {isActive && isHovered && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
        )}
        
        <div className="mr-2 flex-shrink-0">
          <Image
            src={isActive ? "/sidebar/quality&training white.png" : "/sidebar/quality&training.png"}
            alt="Quality & Training"
            width={26}
            height={26}
            unoptimized
          />
        </div>
        
        <span 
          className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
          }`}
        >
          Quality & Training
        </span>
        
        {/* Expand/Collapse Icon */}
        {isHovered && (
          <div className="ml-auto flex-shrink-0">
            {isExpanded ? (
              <ChevronLeft className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
            ) : (
              <ChevronRight className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
            )}
          </div>
        )}
        
        {isActive && isHovered && (
          <div className="ml-auto flex-shrink-0 mr-2">
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>
        )}
      </div>

      {/* Submenu Items - Horizontal Layout */}
      {isExpanded && isHovered && (
        <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in z-50">
          <div className="p-2">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Loading...
              </div>
            ) : qualityTrainings.length > 0 ? (
              <div className="space-y-1">
                {qualityTrainings.map((qualityTraining) => {
                  const itemIsActive = isQualityTrainingItemActive(qualityTraining)
                  return (
                    <Link
                      key={qualityTraining.id}
                      href={`/agent/${qualityTraining.title.toLowerCase().trim().replace(/ /g, '-')}`}
                      className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 group ${
                        itemIsActive
                          ? 'bg-gradient-to-r from-[#0259b7] to-[#017cff] text-white shadow-lg shadow-[#0259b7]/20'
                          : 'text-gray-600 hover:text-[#0259b7] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-200 ${
                        itemIsActive 
                          ? 'bg-white' 
                          : 'bg-gray-300 group-hover:bg-[#0259b7]'
                      }`}></div>
                      <span className={`truncate ${itemIsActive ? 'text-white font-medium' : ''}`}>
                        {qualityTraining.title}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No quality training items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}