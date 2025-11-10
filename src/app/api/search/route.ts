import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient()

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        results: [],
        total: 0,
      })
    }

    const searchTerm = query.trim()
    // const searchPattern = `%${searchTerm}%`

    // Search results array
    const results: Array<{
      type: string
      id: string
      title: string
      description?: string | null
      link: string
      metadata?: Record<string, unknown>
    }> = []

    // Search Brands
    try {
      const brands = await prisma.brand.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
        },
      })

      brands.forEach((brand) => {
        const slug = brand.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Brand',
          id: brand.id,
          title: brand.name,
          description: brand.description,
          link: `/agent/products/${slug}`,
          metadata: { table: 'brands' },
        })
      })
    } catch (err) {
      console.warn('Error searching brands:', err)
    }

    // Search KategoriProduk
    try {
      const categories = await prisma.kategoriProduk.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          brand: {
            select: {
              name: true,
            },
          },
        },
      })

      categories.forEach((category) => {
        const brandSlug = category.brand.name.toLowerCase().trim().replace(/\s+/g, '-')
        const categorySlug = category.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Category',
          id: category.id,
          title: category.name,
          description: category.description,
          link: `/agent/products/${brandSlug}/${categorySlug}`,
          metadata: {
            table: 'kategori_produks',
            brand: category.brand.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching categories:', err)
    }

    // Search SubkategoriProduk
    try {
      const subcategories = await prisma.subkategoriProduk.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          kategoriProduk: {
            include: {
              brand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      subcategories.forEach((subcategory) => {
        const brandSlug = subcategory.kategoriProduk.brand.name.toLowerCase().trim().replace(/\s+/g, '-')
        const categorySlug = subcategory.kategoriProduk.name.toLowerCase().trim().replace(/\s+/g, '-')
        const subcategorySlug = subcategory.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Subcategory',
          id: subcategory.id,
          title: subcategory.name,
          description: subcategory.description,
          link: `/agent/products/${brandSlug}/${categorySlug}/${subcategorySlug}`,
          metadata: {
            table: 'subkategori_produks',
            brand: subcategory.kategoriProduk.brand.name,
            category: subcategory.kategoriProduk.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching subcategories:', err)
    }

    // Search Produk
    try {
      const products = await prisma.produk.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { kapasitas: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          brand: {
            select: {
              name: true,
            },
          },
          kategoriProduk: {
            select: {
              name: true,
            },
          },
          subkategoriProduk: {
            select: {
              name: true,
            },
          },
        },
      })

      products.forEach((product) => {
        let link = '/agent/products'
        if (product.brand) {
          const brandSlug = product.brand.name.toLowerCase().trim().replace(/\s+/g, '-')
          if (product.kategoriProduk) {
            const categorySlug = product.kategoriProduk.name.toLowerCase().trim().replace(/\s+/g, '-')
            if (product.subkategoriProduk) {
              const subcategorySlug = product.subkategoriProduk.name.toLowerCase().trim().replace(/\s+/g, '-')
              const productSlug = product.name.toLowerCase().trim().replace(/\s+/g, '-')
              link = `/agent/products/${brandSlug}/${categorySlug}/${subcategorySlug}/${productSlug}`
            } else {
              const productSlug = product.name.toLowerCase().trim().replace(/\s+/g, '-')
              link = `/agent/products/${brandSlug}/${categorySlug}/${productSlug}`
            }
          } else {
            link = `/agent/products/${brandSlug}`
          }
        }

        results.push({
          type: 'Product',
          id: product.id,
          title: product.name,
          description: product.description || product.kapasitas || undefined,
          link,
          metadata: {
            table: 'produks',
            brand: product.brand?.name,
            category: product.kategoriProduk?.name,
            subcategory: product.subkategoriProduk?.name,
            status: product.status,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching products:', err)
    }

    // Search DetailProduk
    try {
      const detailProducts = await prisma.detailProduk.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { detail: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          produk: {
            include: {
              brand: {
                select: {
                  name: true,
                },
              },
              kategoriProduk: {
                select: {
                  name: true,
                },
              },
              subkategoriProduk: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      detailProducts.forEach((detailProduct) => {
        const product = detailProduct.produk
        let link = '/agent/products'
        if (product.brand) {
          const brandSlug = product.brand.name.toLowerCase().trim().replace(/\s+/g, '-')
          if (product.kategoriProduk) {
            const categorySlug = product.kategoriProduk.name.toLowerCase().trim().replace(/\s+/g, '-')
            if (product.subkategoriProduk) {
              const subcategorySlug = product.subkategoriProduk.name.toLowerCase().trim().replace(/\s+/g, '-')
              const productSlug = product.name.toLowerCase().trim().replace(/\s+/g, '-')
              link = `/agent/products/${brandSlug}/${categorySlug}/${subcategorySlug}/${productSlug}`
            } else {
              const productSlug = product.name.toLowerCase().trim().replace(/\s+/g, '-')
              link = `/agent/products/${brandSlug}/${categorySlug}/${productSlug}`
            }
          } else {
            link = `/agent/products/${brandSlug}`
          }
        }

        results.push({
          type: 'Product Detail',
          id: detailProduct.id,
          title: detailProduct.name,
          description: detailProduct.detail.substring(0, 200),
          link,
          metadata: {
            table: 'detail_produks',
            product: product.name,
            brand: product.brand?.name,
            category: product.kategoriProduk?.name,
            subcategory: product.subkategoriProduk?.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching detail products:', err)
    }

    // Search KategoriSOP
    try {
      const kategoriSOPs = await prisma.kategoriSOP.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
        },
      })

      kategoriSOPs.forEach((kategoriSOP) => {
        const slug = kategoriSOP.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'SOP Category',
          id: kategoriSOP.id,
          title: kategoriSOP.name,
          description: kategoriSOP.description,
          link: `/agent/sop/${slug}`,
          metadata: { table: 'kategori_sops' },
        })
      })
    } catch (err) {
      console.warn('Error searching SOP categories:', err)
    }

    // Search SOP
    try {
      // Prisma generates SOP model as sOP
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prismaClient = prisma as any
      const sops = await prismaClient.sOP.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          kategoriSOP: {
            select: {
              name: true,
            },
          },
        },
      })

      sops.forEach((sop: { id: string; name: string; description: string | null; kategoriSOP: { name: string } }) => {
        const kategoriSlug = sop.kategoriSOP.name.toLowerCase().trim().replace(/\s+/g, '-')
        const sopSlug = sop.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'SOP',
          id: sop.id,
          title: sop.name,
          description: sop.description,
          link: `/agent/sop/${kategoriSlug}/${sopSlug}`,
          metadata: {
            table: 'sops',
            kategoriSOP: sop.kategoriSOP.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching SOPs:', err)
    }

    // Search JenisSOP
    try {
      const jenisSOPs = await prisma.jenisSOP.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          sop: {
            include: {
              kategoriSOP: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      jenisSOPs.forEach((jenisSOP) => {
        const kategoriSlug = jenisSOP.sop.kategoriSOP.name.toLowerCase().trim().replace(/\s+/g, '-')
        const sopSlug = jenisSOP.sop.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Jenis SOP',
          id: jenisSOP.id,
          title: jenisSOP.name,
          description: jenisSOP.content ? jenisSOP.content.substring(0, 200) : undefined,
          link: `/agent/sop/${kategoriSlug}/${sopSlug}`,
          metadata: {
            table: 'jenis_sops',
            kategoriSOP: jenisSOP.sop.kategoriSOP.name,
            sop: jenisSOP.sop.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching jenis SOPs:', err)
    }

    // Search DetailSOP
    try {
      const detailSOPs = await prisma.detailSOP.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { value: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          jenisSOP: {
            include: {
              sop: {
                include: {
                  kategoriSOP: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      detailSOPs.forEach((detailSOP) => {
        const kategoriSlug = detailSOP.jenisSOP.sop.kategoriSOP.name.toLowerCase().trim().replace(/\s+/g, '-')
        const sopSlug = detailSOP.jenisSOP.sop.name.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Detail SOP',
          id: detailSOP.id,
          title: detailSOP.name,
          description: detailSOP.value.substring(0, 200),
          link: `/agent/sop/${kategoriSlug}/${sopSlug}`,
          metadata: {
            table: 'detail_sops',
            kategoriSOP: detailSOP.jenisSOP.sop.kategoriSOP.name,
            sop: detailSOP.jenisSOP.sop.name,
            jenisSOP: detailSOP.jenisSOP.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching detail SOPs:', err)
    }

    // Search Knowledge
    try {
      const knowledges = await prisma.knowledge.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
        },
      })

      knowledges.forEach((knowledge) => {
        const slug = knowledge.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Knowledge',
          id: knowledge.id,
          title: knowledge.title,
          description: knowledge.description,
          link: `/agent/knowledge/${slug}`,
          metadata: { table: 'knowledges' },
        })
      })
    } catch (err) {
      console.warn('Error searching knowledges:', err)
    }

    // Search DetailKnowledge
    try {
      const detailKnowledges = await prisma.detailKnowledge.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          knowledge: {
            select: {
              title: true,
            },
          },
        },
      })

      detailKnowledges.forEach((detailKnowledge) => {
        const knowledgeSlug = detailKnowledge.knowledge.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Detail Knowledge',
          id: detailKnowledge.id,
          title: detailKnowledge.name,
          description: detailKnowledge.description,
          link: `/agent/knowledge/${knowledgeSlug}`,
          metadata: {
            table: 'detail_knowledges',
            knowledge: detailKnowledge.knowledge.title,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching detail knowledges:', err)
    }

    // Search JenisDetailKnowledge
    try {
      const jenisDetailKnowledges = await prisma.jenisDetailKnowledge.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          detailKnowledge: {
            include: {
              knowledge: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      })

      jenisDetailKnowledges.forEach((jenisDetailKnowledge) => {
        const knowledgeSlug = jenisDetailKnowledge.detailKnowledge.knowledge.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Jenis Detail Knowledge',
          id: jenisDetailKnowledge.id,
          title: jenisDetailKnowledge.name,
          description: jenisDetailKnowledge.description,
          link: `/agent/knowledge/${knowledgeSlug}`,
          metadata: {
            table: 'jenis_detail_knowledges',
            knowledge: jenisDetailKnowledge.detailKnowledge.knowledge.title,
            detailKnowledge: jenisDetailKnowledge.detailKnowledge.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching jenis detail knowledges:', err)
    }

    // Search ProdukJenisDetailKnowledge
    try {
      const produkJenisDetailKnowledges = await prisma.produkJenisDetailKnowledge.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          jenisDetailKnowledge: {
            include: {
              detailKnowledge: {
                include: {
                  knowledge: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      produkJenisDetailKnowledges.forEach((produkJenisDetailKnowledge) => {
        const knowledgeSlug = produkJenisDetailKnowledge.jenisDetailKnowledge.detailKnowledge.knowledge.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Produk Jenis Detail Knowledge',
          id: produkJenisDetailKnowledge.id,
          title: produkJenisDetailKnowledge.name,
          description: produkJenisDetailKnowledge.description,
          link: `/agent/knowledge/${knowledgeSlug}`,
          metadata: {
            table: 'produk_jenis_detail_knowledges',
            knowledge: produkJenisDetailKnowledge.jenisDetailKnowledge.detailKnowledge.knowledge.title,
            detailKnowledge: produkJenisDetailKnowledge.jenisDetailKnowledge.detailKnowledge.name,
            jenisDetailKnowledge: produkJenisDetailKnowledge.jenisDetailKnowledge.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching produk jenis detail knowledges:', err)
    }

    // Search QualityTraining
    try {
      const qualityTrainings = await prisma.qualityTraining.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
        },
      })

      qualityTrainings.forEach((qualityTraining) => {
        const slug = qualityTraining.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Quality Training',
          id: qualityTraining.id,
          title: qualityTraining.title,
          description: qualityTraining.description,
          link: `/agent/quality-training/${slug}`,
          metadata: { table: 'quality_trainings' },
        })
      })
    } catch (err) {
      console.warn('Error searching quality trainings:', err)
    }

    // Search JenisQualityTraining
    try {
      const jenisQualityTrainings = await prisma.jenisQualityTraining.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          qualityTraining: {
            select: {
              title: true,
            },
          },
        },
      })

      jenisQualityTrainings.forEach((jenisQualityTraining) => {
        const qualityTrainingSlug = jenisQualityTraining.qualityTraining.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Jenis Quality Training',
          id: jenisQualityTraining.id,
          title: jenisQualityTraining.name,
          description: jenisQualityTraining.description,
          link: `/agent/quality-training/${qualityTrainingSlug}`,
          metadata: {
            table: 'jenis_quality_trainings',
            qualityTraining: jenisQualityTraining.qualityTraining.title,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching jenis quality trainings:', err)
    }

    // Search DetailQualityTraining
    try {
      const detailQualityTrainings = await prisma.detailQualityTraining.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          jenisQualityTraining: {
            include: {
              qualityTraining: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      })

      detailQualityTrainings.forEach((detailQualityTraining) => {
        const qualityTrainingSlug = detailQualityTraining.jenisQualityTraining.qualityTraining.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Detail Quality Training',
          id: detailQualityTraining.id,
          title: detailQualityTraining.name,
          description: detailQualityTraining.description,
          link: `/agent/quality-training/${qualityTrainingSlug}`,
          metadata: {
            table: 'detail_quality_trainings',
            qualityTraining: detailQualityTraining.jenisQualityTraining.qualityTraining.title,
            jenisQualityTraining: detailQualityTraining.jenisQualityTraining.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching detail quality trainings:', err)
    }

    // Search SubdetailQualityTraining
    try {
      const subdetailQualityTrainings = await prisma.subdetailQualityTraining.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          detailQualityTraining: {
            include: {
              jenisQualityTraining: {
                include: {
                  qualityTraining: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      subdetailQualityTrainings.forEach((subdetailQualityTraining) => {
        const qualityTrainingSlug = subdetailQualityTraining.detailQualityTraining.jenisQualityTraining.qualityTraining.title.toLowerCase().trim().replace(/\s+/g, '-')
        results.push({
          type: 'Subdetail Quality Training',
          id: subdetailQualityTraining.id,
          title: subdetailQualityTraining.name,
          description: subdetailQualityTraining.description,
          link: `/agent/quality-training/${qualityTrainingSlug}`,
          metadata: {
            table: 'subdetail_quality_trainings',
            qualityTraining: subdetailQualityTraining.detailQualityTraining.jenisQualityTraining.qualityTraining.title,
            jenisQualityTraining: subdetailQualityTraining.detailQualityTraining.jenisQualityTraining.name,
            detailQualityTraining: subdetailQualityTraining.detailQualityTraining.name,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching subdetail quality trainings:', err)
    }

    // Search User
    try {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })

      users.forEach((user) => {
        results.push({
          type: 'User',
          id: user.id,
          title: user.name,
          description: user.email,
          link: '#', // No specific page for users
          metadata: {
            table: 'users',
            email: user.email,
            role: user.role,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching users:', err)
    }

    // Search Agent
    try {
      const agents = await prisma.agent.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          category: true,
        },
      })

      agents.forEach((agent) => {
        results.push({
          type: 'Agent',
          id: agent.id,
          title: agent.name,
          description: agent.email,
          link: '#', // No specific page for agents
          metadata: {
            table: 'agents',
            email: agent.email,
            category: agent.category,
          },
        })
      })
    } catch (err) {
      console.warn('Error searching agents:', err)
    }

    return NextResponse.json({
      results,
      total: results.length,
      query: searchTerm,
    })
  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      { error: 'Failed to perform search', results: [], total: 0 },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.warn('Error disconnecting Prisma client:', disconnectError)
    }
  }
}

