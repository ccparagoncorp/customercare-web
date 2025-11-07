"use client"

import Link from "next/link"
import { ChevronRight, Home, Package } from "lucide-react"
import { useState, useEffect } from "react"

interface Brand {
  id: string
  name: string
}

interface BreadcrumbProps {
  brandName?: string
  brandId?: string
  categoryId?: string
  subcategoryId?: string
  productId?: string
}

export function Breadcrumb({ brandName, brandId, categoryId, subcategoryId, productId }: BreadcrumbProps) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [category, setCategory] = useState<{ id: string; name: string } | null>(null)
  const [subcategory, setSubcategory] = useState<{ id: string; name: string } | null>(null)
  const [product, setProduct] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set brand from name if provided
        if (brandName) {
          setBrand({ id: '', name: brandName })
               } else if (brandId) {
                 // Fetch brand by ID - convert to name-based lookup
                 const brandResponse = await fetch(`/api/brands`)
                 if (brandResponse.ok) {
                   const brandsData: Brand[] = await brandResponse.json()
                   const brandData = brandsData.find((b) => b.id === brandId)
                   if (brandData) {
                     setBrand(brandData)
                   }
                 }
               }

        // Fetch category if provided
        if (categoryId) {
          const categoryResponse = await fetch(`/api/categories/${categoryId}/breadcrumb`)
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json()
            setCategory(categoryData)
          }
        }

        // Fetch subcategory if provided
        if (subcategoryId) {
          const subcategoryResponse = await fetch(`/api/subcategories/${subcategoryId}/breadcrumb`)
          if (subcategoryResponse.ok) {
            const subcategoryData = await subcategoryResponse.json()
            setSubcategory(subcategoryData)
          }
        }

        // Fetch product if provided
        if (productId) {
          const productResponse = await fetch(`/api/products/${productId}/breadcrumb`)
          if (productResponse.ok) {
            const productData = await productResponse.json()
            setProduct(productData)
          }
        }
      } catch (error) {
        console.error('Error fetching breadcrumb data:', error)
      }
    }

    fetchData()
  }, [brandName, brandId, categoryId, subcategoryId, productId])

  const breadcrumbItems = [
    {
      label: "Products",
      href: "/agent/products",
      icon: Home
    },
    {
      label: brand?.name || "Brand",
      href: brandName ? `/agent/products/brand/${encodeURIComponent(brandName.toLowerCase().replace(/\s+/g, '-'))}` : `/agent/products/brand/${brandId}`,
      icon: Package
    }
  ]

  if (category) {
    breadcrumbItems.push({
      label: category.name,
      href: `/agent/products/brand/${brandId}/category/${categoryId}`,
      icon: Package
    })
  }

  if (subcategory) {
    breadcrumbItems.push({
      label: subcategory.name,
      href: `/agent/products/brand/${brandId}/category/${categoryId}/subcategory/${subcategoryId}`,
      icon: Package
    })
  }

  if (product) {
    breadcrumbItems.push({
      label: product.name,
      href: `/agent/products/brand/${brandId}/category/${categoryId}/subcategory/${subcategoryId}/product/${productId}`,
      icon: Package
    })
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbItems.map((item, index) => {
        const Icon = item.icon
        const isLast = index === breadcrumbItems.length - 1
        
        return (
          <div key={index} className="flex items-center space-x-2">
            {index === 0 && (
              <>
                <Icon className="h-4 w-4" />
                <Link 
                  href={item.href}
                  className="hover:text-[#0259b7] transition-colors"
                >
                  {item.label}
                </Link>
              </>
            )}
            
            {index > 0 && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                ) : (
                  <Link 
                    href={item.href}
                    className="hover:text-[#0259b7] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )
      })}
    </nav>
  )
}
