import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandName: string; categoryName: string; params: string[] }> }
) {
  const prisma = createPrismaClient()

  try {
    const { brandName, categoryName, params: routeParams } = await params
    
    // Decode the names
    const decodedBrandName = decodeURIComponent(brandName).replace(/-/g, ' ')
    const decodedCategoryName = decodeURIComponent(categoryName).replace(/-/g, ' ')

    let product

    if (routeParams.length === 2) {
      // [subcategoryName, productName]
      const decodedSubcategoryName = decodeURIComponent(routeParams[0]).replace(/-/g, ' ')
      const decodedProductName = decodeURIComponent(routeParams[1]).replace(/-/g, ' ')
      
      product = await prisma.produk.findFirst({
        where: {
          name: {
            equals: decodedProductName,
            mode: 'insensitive'
          },
          subkategoriProduk: {
            name: {
              equals: decodedSubcategoryName,
              mode: 'insensitive'
            },
            kategoriProduk: {
              name: {
                equals: decodedCategoryName,
                mode: 'insensitive'
              },
              brand: {
                name: {
                  equals: decodedBrandName,
                  mode: 'insensitive'
                }
              }
            }
          }
        },
        include: {
          subkategoriProduk: {
            include: {
              kategoriProduk: {
                include: {
                  brand: true
                }
              }
            }
          }
        }
      })
    } else if (routeParams.length === 1) {
      // [productName] - direct from category
      const decodedProductName = decodeURIComponent(routeParams[0]).replace(/-/g, ' ')
      
      product = await prisma.produk.findFirst({
        where: {
          name: {
            equals: decodedProductName,
            mode: 'insensitive'
          },
          subkategoriProduk: {
            kategoriProduk: {
              name: {
                equals: decodedCategoryName,
                mode: 'insensitive'
              },
              brand: {
                name: {
                  equals: decodedBrandName,
                  mode: 'insensitive'
                }
              }
            }
          }
        },
        include: {
          subkategoriProduk: {
            include: {
              kategoriProduk: {
                include: {
                  brand: true
                }
              }
            }
          }
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
