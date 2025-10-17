const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function setupAgent() {
  try {
    const email = 'agent@paragon.co.id'
    const password = 'your-existing-password' // Ganti dengan password yang sudah Anda daftarkan
    const name = 'Agent Demo'

    console.log('Creating user in Supabase Auth...')
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating user in Supabase Auth:', authError)
      return
    }

    console.log('User created in Supabase Auth:', authData.user.id)

    // Create agent record in database using Supabase user ID
    const agent = await prisma.agent.upsert({
      where: { id: authData.user.id },
      update: {
        name,
        email,
        category: 'socialMedia',
        isActive: true
      },
      create: {
        id: authData.user.id, // Use Supabase user ID
        name,
        email,
        category: 'socialMedia',
        isActive: true
      }
    })

    console.log('Agent created/updated in database:', {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      category: agent.category,
      isActive: agent.isActive
    })

    console.log('\n✅ Setup completed!')
    console.log('\nLogin credentials:')
    console.log('Email:', email)
    console.log('Password:', password)

  } catch (error) {
    console.error('Error setting up agent:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAgent()
