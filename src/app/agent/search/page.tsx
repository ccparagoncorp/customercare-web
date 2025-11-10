"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Layout } from "@/components/agents/dashboard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Search, ArrowRight, FileText, Package, BookOpen, GraduationCap, Users, FolderOpen } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  type: string
  id: string
  title: string
  description?: string | null
  link: string
  metadata?: Record<string, unknown>
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const searchQuery = searchParams.get('q') || ''
    setQuery(searchQuery)

    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery)
    } else {
      setResults([])
      setTotal(0)
    }
  }, [searchParams])

  const performSearch = async (searchTerm: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=100`)
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
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length > 0) {
      router.push(`/agent/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Brand':
      case 'Category':
      case 'Subcategory':
      case 'Product':
      case 'Product Detail':
        return <Package className="h-5 w-5" />
      case 'SOP Category':
      case 'SOP':
      case 'Jenis SOP':
      case 'Detail SOP':
        return <FileText className="h-5 w-5" />
      case 'Knowledge':
      case 'Detail Knowledge':
      case 'Jenis Detail Knowledge':
      case 'Produk Jenis Detail Knowledge':
        return <BookOpen className="h-5 w-5" />
      case 'Quality Training':
      case 'Jenis Quality Training':
      case 'Detail Quality Training':
      case 'Subdetail Quality Training':
        return <GraduationCap className="h-5 w-5" />
      case 'User':
      case 'Agent':
        return <Users className="h-5 w-5" />
      default:
        return <FolderOpen className="h-5 w-5" />
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

  return (
    <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="space-y-6">
              {/* Header */}
              <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search across all content..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#03438f] focus:border-transparent text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#03438f] text-white px-4 py-2 rounded-lg hover:bg-[#012f65] transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03438f] mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                </div>
              ) : query.trim().length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter a search term</h3>
                  <p className="text-gray-500">Type a keyword above to search across all content</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500">Try different keywords or check your spelling</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Results Summary */}
                  <div className="text-sm text-gray-600">
                    Found <span className="font-semibold text-gray-900">{total}</span> result{total !== 1 ? 's' : ''} for &quot;<span className="font-semibold text-gray-900">{query}</span>&quot;
                  </div>

                  {/* Results List */}
                  <div className="space-y-3">
                    {results.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.link}
                        className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-[#03438f]"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getTypeColor(result.type)} flex items-center justify-center border-2`}>
                            {getTypeIcon(result.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(result.type)}`}>
                                {result.type}
                              </span>
                              {result.metadata && (() => {
                                const brand = result.metadata.brand ? String(result.metadata.brand) : null
                                const category = result.metadata.category ? String(result.metadata.category) : null
                                const subcategory = result.metadata.subcategory ? String(result.metadata.subcategory) : null
                                const kategoriSOP = result.metadata.kategoriSOP ? String(result.metadata.kategoriSOP) : null
                                const sop = result.metadata.sop ? String(result.metadata.sop) : null
                                const knowledge = result.metadata.knowledge ? String(result.metadata.knowledge) : null
                                const qualityTraining = result.metadata.qualityTraining ? String(result.metadata.qualityTraining) : null
                                
                                const hasAnyMetadata = brand || category || subcategory || kategoriSOP || sop || knowledge || qualityTraining
                                
                                if (!hasAnyMetadata) return null
                                
                                return (
                                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                    {brand && <span>Brand: {brand}</span>}
                                    {category && (
                                      <>
                                        {brand && <span>•</span>}
                                        <span>Category: {category}</span>
                                      </>
                                    )}
                                    {subcategory && (
                                      <>
                                        {(brand || category) && <span>•</span>}
                                        <span>Subcategory: {subcategory}</span>
                                      </>
                                    )}
                                    {kategoriSOP && (
                                      <>
                                        {brand && <span>•</span>}
                                        <span>Category: {kategoriSOP}</span>
                                      </>
                                    )}
                                    {sop && (
                                      <>
                                        {kategoriSOP && <span>•</span>}
                                        <span>SOP: {sop}</span>
                                      </>
                                    )}
                                    {knowledge && (
                                      <>
                                        {brand && <span>•</span>}
                                        <span>Knowledge: {knowledge}</span>
                                      </>
                                    )}
                                    {qualityTraining && (
                                      <>
                                        {brand && <span>•</span>}
                                        <span>Quality Training: {qualityTraining}</span>
                                      </>
                                    )}
                                  </div>
                                )
                              })()}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{result.title}</h3>
                            {result.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0">
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  )
}

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03438f] mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  )
}

