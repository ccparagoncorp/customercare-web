import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.detailKnowledge.deleteMany()
  await prisma.knowledge.deleteMany()
  await prisma.detailSOP.deleteMany()
  await prisma.jenisSOP.deleteMany()
  await prisma.sOP.deleteMany()
  await prisma.kategoriSOP.deleteMany()
  await prisma.detailProduk.deleteMany()
  await prisma.produk.deleteMany()
  await prisma.subkategoriProduk.deleteMany()
  await prisma.kategoriProduk.deleteMany()
  await prisma.brand.deleteMany()

  console.log('🗑️ Cleared existing data')

  // Create Brands
  const wardah = await prisma.brand.create({
    data: {
      name: 'Wardah',
      description: 'Brand kosmetik halal terdepan di Indonesia'
    }
  })

  const emina = await prisma.brand.create({
    data: {
      name: 'Emina',
      description: 'Brand kosmetik untuk remaja yang trendy dan affordable'
    }
  })

  const makeover = await prisma.brand.create({
    data: {
      name: 'Make Over',
      description: 'Brand kosmetik professional untuk make up artist'
    }
  })

  console.log('✅ Created brands')

  // Create KategoriProduk
  const skincare = await prisma.kategoriProduk.create({
    data: {
      name: 'Skincare',
      description: 'Produk perawatan kulit',
      brandId: wardah.id
    }
  })

  const makeup = await prisma.kategoriProduk.create({
    data: {
      name: 'Makeup',
      description: 'Produk kosmetik dan make up',
      brandId: wardah.id
    }
  })

  const teenSkincare = await prisma.kategoriProduk.create({
    data: {
      name: 'Teen Skincare',
      description: 'Skincare khusus remaja',
      brandId: emina.id
    }
  })

  console.log('✅ Created kategori produk')

  // Create SubkategoriProduk
  const facialWash = await prisma.subkategoriProduk.create({
    data: {
      name: 'Facial Wash',
      description: 'Pembersih wajah',
      kategoriProdukId: skincare.id
    }
  })

  const moisturizer = await prisma.subkategoriProduk.create({
    data: {
      name: 'Moisturizer',
      description: 'Pelembab wajah',
      kategoriProdukId: skincare.id
    }
  })

  const foundation = await prisma.subkategoriProduk.create({
    data: {
      name: 'Foundation',
      description: 'Bedak foundation',
      kategoriProdukId: makeup.id
    }
  })

  const teenCleanser = await prisma.subkategoriProduk.create({
    data: {
      name: 'Teen Cleanser',
      description: 'Pembersih wajah untuk remaja',
      kategoriProdukId: teenSkincare.id
    }
  })

  console.log('✅ Created subkategori produk')

  // Create Produk
  const wardahFacialWash = await prisma.produk.create({
    data: {
      name: 'Wardah Perfect Bright Facial Foam',
      description: 'Pembersih wajah dengan formula brightening',
      sku: 'WAR-FW-001',
      price: 25000,
      stock: 100,
      subkategoriProdukId: facialWash.id
    }
  })

  const wardahMoisturizer = await prisma.produk.create({
    data: {
      name: 'Wardah Hydra Rose Moisturizer',
      description: 'Pelembab dengan ekstrak rose',
      sku: 'WAR-MO-001',
      price: 45000,
      stock: 75,
      subkategoriProdukId: moisturizer.id
    }
  })

  const wardahFoundation = await prisma.produk.create({
    data: {
      name: 'Wardah Lightening Foundation',
      description: 'Foundation dengan efek brightening',
      sku: 'WAR-FD-001',
      price: 65000,
      stock: 50,
      subkategoriProdukId: foundation.id
    }
  })

  const eminaCleanser = await prisma.produk.create({
    data: {
      name: 'Emina Bright Stuff Face Wash',
      description: 'Face wash untuk kulit remaja',
      sku: 'EMI-FW-001',
      price: 20000,
      stock: 80,
      subkategoriProdukId: teenCleanser.id
    }
  })

  console.log('✅ Created produk')

  // Create DetailProduk
  await prisma.detailProduk.createMany({
    data: [
      {
        name: 'Volume',
        value: '100ml',
        produkId: wardahFacialWash.id
      },
      {
        name: 'Skin Type',
        value: 'All Skin Types',
        produkId: wardahFacialWash.id
      },
      {
        name: 'Volume',
        value: '50ml',
        produkId: wardahMoisturizer.id
      },
      {
        name: 'Skin Type',
        value: 'Dry to Normal',
        produkId: wardahMoisturizer.id
      },
      {
        name: 'Shade',
        value: 'Natural',
        produkId: wardahFoundation.id
      },
      {
        name: 'Volume',
        value: '30ml',
        produkId: wardahFoundation.id
      },
      {
        name: 'Volume',
        value: '100ml',
        produkId: eminaCleanser.id
      },
      {
        name: 'Target Age',
        value: '13-25 years',
        produkId: eminaCleanser.id
      }
    ]
  })

  console.log('✅ Created detail produk')

  // Create KategoriSOP
  const customerService = await prisma.kategoriSOP.create({
    data: {
      name: 'Customer Service',
      description: 'Standard Operating Procedures untuk layanan pelanggan'
    }
  })

  const sales = await prisma.kategoriSOP.create({
    data: {
      name: 'Sales',
      description: 'Standard Operating Procedures untuk penjualan'
    }
  })

  const warehouse = await prisma.kategoriSOP.create({
    data: {
      name: 'Warehouse',
      description: 'Standard Operating Procedures untuk gudang'
    }
  })

  console.log('✅ Created kategori SOP')

  // Create SOP
  const csGreeting = await prisma.sOP.create({
    data: {
      name: 'Customer Greeting Protocol',
      description: 'Prosedur menyapa pelanggan',
      kategoriSOPId: customerService.id
    }
  })

  const complaintHandling = await prisma.sOP.create({
    data: {
      name: 'Complaint Handling',
      description: 'Prosedur menangani keluhan pelanggan',
      kategoriSOPId: customerService.id
    }
  })

  const salesProcess = await prisma.sOP.create({
    data: {
      name: 'Sales Process',
      description: 'Prosedur proses penjualan',
      kategoriSOPId: sales.id
    }
  })

  console.log('✅ Created SOP')

  // Create JenisSOP
  const greetingSteps = await prisma.jenisSOP.create({
    data: {
      name: 'Greeting Steps',
      content: 'Langkah-langkah menyapa pelanggan dengan ramah',
      sopId: csGreeting.id
    }
  })

  const complaintSteps = await prisma.jenisSOP.create({
    data: {
      name: 'Complaint Resolution Steps',
      content: 'Langkah-langkah menyelesaikan keluhan pelanggan',
      sopId: complaintHandling.id
    }
  })

  const salesSteps = await prisma.jenisSOP.create({
    data: {
      name: 'Sales Process Steps',
      content: 'Langkah-langkah proses penjualan',
      sopId: salesProcess.id
    }
  })

  console.log('✅ Created Jenis SOP')

  // Create DetailSOP
  await prisma.detailSOP.createMany({
    data: [
      {
        name: 'Step 1',
        value: 'Ucapkan salam dengan ramah',
        jenisSOPId: greetingSteps.id
      },
      {
        name: 'Step 2',
        value: 'Tanyakan kebutuhan pelanggan',
        jenisSOPId: greetingSteps.id
      },
      {
        name: 'Step 3',
        value: 'Berikan rekomendasi produk',
        jenisSOPId: greetingSteps.id
      },
      {
        name: 'Listen',
        value: 'Dengarkan keluhan pelanggan dengan seksama',
        jenisSOPId: complaintSteps.id
      },
      {
        name: 'Empathize',
        value: 'Tunjukkan empati terhadap permasalahan pelanggan',
        jenisSOPId: complaintSteps.id
      },
      {
        name: 'Resolve',
        value: 'Berikan solusi yang sesuai',
        jenisSOPId: complaintSteps.id
      },
      {
        name: 'Approach',
        value: 'Mendekati pelanggan dengan ramah',
        jenisSOPId: salesSteps.id
      },
      {
        name: 'Present',
        value: 'Presentasikan produk dengan menarik',
        jenisSOPId: salesSteps.id
      },
      {
        name: 'Close',
        value: 'Tutup penjualan dengan efektif',
        jenisSOPId: salesSteps.id
      }
    ]
  })

  console.log('✅ Created Detail SOP')

  // Create Knowledge
  const productKnowledge = await prisma.knowledge.create({
    data: {
      title: 'Pengetahuan Produk Wardah',
      description: 'Informasi lengkap tentang produk-produk Wardah',
      content: 'Wardah adalah brand kosmetik halal terdepan di Indonesia...',
      category: 'Product Knowledge',
      tags: ['wardah', 'produk', 'kosmetik', 'halal']
    }
  })

  const customerCare = await prisma.knowledge.create({
    data: {
      title: 'Customer Care Best Practices',
      description: 'Praktik terbaik dalam melayani pelanggan',
      content: 'Customer care yang baik adalah kunci kesuksesan bisnis...',
      category: 'Customer Service',
      tags: ['customer', 'service', 'best-practice']
    }
  })

  const salesTips = await prisma.knowledge.create({
    data: {
      title: 'Tips Penjualan Efektif',
      description: 'Tips dan trik untuk meningkatkan penjualan',
      content: 'Penjualan yang efektif memerlukan pendekatan yang tepat...',
      category: 'Sales',
      tags: ['sales', 'tips', 'efektif']
    }
  })

  console.log('✅ Created Knowledge')

  // Create DetailKnowledge
  await prisma.detailKnowledge.createMany({
    data: [
      {
        name: 'Key Benefits',
        value: 'Halal, aman untuk kulit, harga terjangkau',
        knowledgeId: productKnowledge.id
      },
      {
        name: 'Target Market',
        value: 'Wanita muslimah usia 18-45 tahun',
        knowledgeId: productKnowledge.id
      },
      {
        name: 'Competitive Advantage',
        value: 'Brand halal pertama di Indonesia',
        knowledgeId: productKnowledge.id
      },
      {
        name: 'Communication Style',
        value: 'Ramah, empati, dan profesional',
        knowledgeId: customerCare.id
      },
      {
        name: 'Response Time',
        value: 'Maksimal 5 menit untuk setiap inquiry',
        knowledgeId: customerCare.id
      },
      {
        name: 'Follow-up',
        value: 'Lakukan follow-up 24 jam setelah interaksi',
        knowledgeId: customerCare.id
      },
      {
        name: 'Building Rapport',
        value: 'Bangun hubungan baik dengan pelanggan',
        knowledgeId: salesTips.id
      },
      {
        name: 'Product Knowledge',
        value: 'Kuasai pengetahuan produk secara mendalam',
        knowledgeId: salesTips.id
      },
      {
        name: 'Closing Techniques',
        value: 'Gunakan teknik closing yang tepat',
        knowledgeId: salesTips.id
      }
    ]
  })

  console.log('✅ Created Detail Knowledge')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
