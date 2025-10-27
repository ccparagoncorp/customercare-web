"use client"

import { Package, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: 'brands' | 'categories' | 'products' | 'search'
  onReset?: () => void
  className?: string
}

export function EmptyState({ type, onReset, className = "" }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'brands':
        return {
          icon: Package,
          title: 'No brands available',
          description: 'Check back later for product updates',
          showReset: false
        }
      case 'categories':
        return {
          icon: Package,
          title: 'No categories available',
          description: 'This brand doesn\'t have any product categories yet',
          showReset: false
        }
      case 'products':
        return {
          icon: Package,
          title: 'No products available',
          description: 'This category doesn\'t have any products yet',
          showReset: false
        }
      case 'search':
        return {
          icon: Search,
          title: 'No results found',
          description: 'Try adjusting your search terms or filters',
          showReset: true
        }
      default:
        return {
          icon: Package,
          title: 'No data available',
          description: 'Check back later for updates',
          showReset: false
        }
    }
  }

  const content = getContent()
  const Icon = content.icon

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-gray-500 mb-6">
        <Icon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {content.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {content.description}
        </p>
        {content.showReset && onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            className="inline-flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Clear Filters</span>
          </Button>
        )}
      </div>
    </div>
  )
}
