"use client"

import { useEffect, useState, useRef } from "react"
import { Search, ArrowRight, FileText, Package, BookOpen, GraduationCap, Users, FolderOpen, Loader2 } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  type: string
  id: string
  title: string
  description?: string | null
  link: string
  metadata?: Record<string, unknown>
}

interface SearchDropdownProps {
  query: string
  isOpen: boolean
  onClose: () => void
}

export function SearchDropdown({ query, isOpen, onClose }: SearchDropdownProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If query is empty or dropdown is closed, clear results
    if (!query.trim() || !isOpen) {
      setResults([])
      setTotal(0)
      return
    }

    // Debounce search API call
    setLoading(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
          setTotal(data.total || 0)
        } else {
          setResults([])
          setTotal(0)
        }
      } catch (error) {
        console.error('Error performing search:', error)
        setResults([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Brand':
      case 'Category':
      case 'Subcategory':
      case 'Product':
      case 'Product Detail':
        return <Package className="h-4 w-4" />
      case 'SOP Category':
      case 'SOP':
      case 'Jenis SOP':
      case 'Detail SOP':
        return <FileText className="h-4 w-4" />
      case 'Knowledge':
      case 'Detail Knowledge':
      case 'Jenis Detail Knowledge':
      case 'Produk Jenis Detail Knowledge':
        return <BookOpen className="h-4 w-4" />
      case 'Quality Training':
      case 'Jenis Quality Training':
      case 'Detail Quality Training':
      case 'Subdetail Quality Training':
        return <GraduationCap className="h-4 w-4" />
      case 'User':
      case 'Agent':
        return <Users className="h-4 w-4" />
      default:
        return <FolderOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Brand':
      case 'Category':
      case 'Subcategory':
      case 'Product':
      case 'Product Detail':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SOP Category':
      case 'SOP':
      case 'Jenis SOP':
      case 'Detail SOP':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Knowledge':
      case 'Detail Knowledge':
      case 'Jenis Detail Knowledge':
      case 'Produk Jenis Detail Knowledge':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Quality Training':
      case 'Jenis Quality Training':
      case 'Detail Quality Training':
      case 'Subdetail Quality Training':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'User':
      case 'Agent':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isOpen || !query.trim()) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50"
    >
      {loading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-6 w-6 text-[#03438f] animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No results found</p>
        </div>
      ) : (
        <div className="py-2">
          {/* Results Summary */}
          {total > 10 && (
            <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
              Showing 10 of {total} results
            </div>
          )}

          {/* Results List */}
          <div className="divide-y divide-gray-100">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.link}
                onClick={onClose}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${getTypeColor(result.type)} flex items-center justify-center border`}>
                    {getTypeIcon(result.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                      {result.metadata && (() => {
                        const brand = result.metadata.brand ? String(result.metadata.brand) : null
                        const category = result.metadata.category ? String(result.metadata.category) : null
                        const kategoriSOP = result.metadata.kategoriSOP ? String(result.metadata.kategoriSOP) : null
                        
                        if (!brand && !category && !kategoriSOP) return null
                        
                        return (
                          <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                            {brand && <span className="truncate">Brand: {brand}</span>}
                            {category && (
                              <>
                                {brand && <span>•</span>}
                                <span className="truncate">{category}</span>
                              </>
                            )}
                            {kategoriSOP && (
                              <>
                                {brand && <span>•</span>}
                                <span className="truncate">{kategoriSOP}</span>
                              </>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">{result.title}</h3>
                    {result.description && (
                      <p className="text-xs text-gray-600 line-clamp-1">{result.description}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Results Link */}
          {total > 10 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <Link
                href={`/agent/search?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 text-sm font-medium text-[#03438f] hover:text-[#012f65]"
              >
                <span>View all {total} results</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

