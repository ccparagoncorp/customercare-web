"use client"

import { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterBarProps {
  onFilterChange: (filters: { status?: string; sortBy?: string }) => void
  className?: string
}

export function FilterBar({ onFilterChange, className = "" }: FilterBarProps) {
  const [filters, setFilters] = useState<{ status?: string; sortBy?: string }>({})

  const handleStatusChange = (status: string) => {
    const newFilters = { ...filters, status: status === "all" ? undefined : status }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy: sortBy === "default" ? undefined : sortBy }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Filter:</span>
      </div>
      
      <Select onValueChange={handleStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="REVAMP">Revamp</SelectItem>
          <SelectItem value="DISCONTINUE">Discontinue</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Sort:</span>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="created">Newest</SelectItem>
            <SelectItem value="created-desc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
