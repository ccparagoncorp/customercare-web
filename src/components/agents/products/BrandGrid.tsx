"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Package, Star } from "lucide-react"
import { SearchBar } from "./SearchBar"
import { FilterBar } from "./FilterBar"
import { Pagination } from "./Pagination"
import { LoadingGrid } from "./LoadingGrid"
import { EmptyState } from "./EmptyState"
import { Tooltip } from "./Tooltip"

interface Brand {
  id: string
  name: string
  description: string | null
  colorbase: string | null
  images: string[]
  createdAt: Date
  updatedAt: Date
  kategoriProduks: {
    id: string
    name: string
    subkategoriProduks: {
      id: string
      name: string
      produks: {
        id: string
        name: string
        status: string
      }[]
    }[]
  }[]
}

export function BrandGrid() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }
        const data = await response.json()
        setBrands(data)
        setFilteredBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(query.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredBrands(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilterChange = (filters: { status?: string; sortBy?: string }) => {
    let filtered = [...brands]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (brand.description && brand.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'created':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'created-desc':
          filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
      }
    }

    setFilteredBrands(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  if (loading) {
    return <LoadingGrid count={9} />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error loading brands</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (filteredBrands.length === 0 && !loading) {
    return (
      <EmptyState
        type={searchQuery ? 'search' : 'brands'}
        onReset={() => {
          setSearchQuery('')
          setFilteredBrands(brands)
          setCurrentPage(1)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar 
          placeholder="Search brands..." 
          onSearch={handleSearch}
          className="flex-1 max-w-md"
        />
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBrands.length)}-{Math.min(currentPage * itemsPerPage, filteredBrands.length)} of {filteredBrands.length} brands
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((brand) => {
          const totalProducts = brand.kategoriProduks.reduce((total, kategori) => {
            return total + kategori.subkategoriProduks.reduce((subTotal, subkategori) => {
              return subTotal + subkategori.produks.length
            }, 0)
          }, 0)

          const totalCategories = brand.kategoriProduks.length

          return (
            <Link key={brand.id} href={`/agent/products/brand/${brand.id}`}>
              <Card className="group product-card-hover cursor-pointer border-0 product-gradient-bg stagger-item">
                <div className="p-6">
                    
                  {/* Brand Image */}
                  <div className="relative h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {brand.images && brand.images.length > 0 ? (
                      <Image
                        src={brand.images[0]}
                        alt={brand.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <Tooltip content={`${brand.name} - ${totalProducts} products across ${totalCategories} categories`}>
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          <Star className="h-3 w-3 mr-1" />
                          Brand
                        </Badge>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0259b7] transition-colors">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          {totalProducts} Products
                        </span>
                        <span className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          {totalCategories} Categories
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <div className="flex items-center justify-center w-full py-2 px-4 btn-primary text-white rounded-lg group-hover:shadow-lg transition-all duration-300">
                        <span className="text-sm font-medium">Explore Products</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBrands.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </div>
  )
}
