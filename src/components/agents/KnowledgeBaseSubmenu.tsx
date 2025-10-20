"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

interface Knowledge {
  id: string
  title: string
  description?: string
  createdAt: string
  slug: string
}

interface KnowledgeBaseSubmenuProps {
  isHovered: boolean
  isActive: boolean
}

export function KnowledgeBaseSubmenu({ isHovered, isActive }: KnowledgeBaseSubmenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [knowledges, setKnowledges] = useState<Knowledge[]>([])
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  // Fetch knowledge data when expanded
  useEffect(() => {
    if (isExpanded && knowledges.length === 0) {
      fetchKnowledges()
    }
  }, [isExpanded])

  // Close submenu when sidebar is not hovered
  useEffect(() => {
    if (!isHovered) {
      setIsExpanded(false)
    }
  }, [isHovered])

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

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Function to check if a knowledge item is active based on current pathname
  const isKnowledgeItemActive = (knowledge: Knowledge): boolean => {
    const slug = knowledge.title.toLowerCase().trim().replace(/ /g, '-')
    const knowledgePath = `/agent/knowledge/${slug}`
    return pathname === knowledgePath
  }

  return (
    <div className="space-y-1 relative">
      {/* Main Knowledge Base Item */}
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
            src={isActive ? "/sidebar/knowledgebasewhite.png" : "/sidebar/knowledgebase.png"}
            alt="Knowledge Base"
            width={26}
            height={26}
          />
        </div>
        
        <span 
          className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
          }`}
        >
          Knowledge Base
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
            ) : knowledges.length > 0 ? (
              <div className="space-y-1">
                {knowledges.map((knowledge) => {
                  const itemIsActive = isKnowledgeItemActive(knowledge)
                  return (
                    <Link
                      key={knowledge.id}
                      href={`/agent/knowledge/${knowledge.title.toLowerCase().trim().replace(/ /g, '-')}`}
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
                        {knowledge.title}
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No knowledge base items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
