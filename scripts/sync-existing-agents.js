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

// Mapping email ke password yang sudah Anda daftarkan
const agentPasswords = {
  'agent@paragon.co.id': 'password123', // Ganti dengan password yang benar
  'agent2@paragon.co.id': 'password456', // Tambahkan email lain jika ada
  // Tambahkan email dan password lainnya sesuai kebutuhan
}

async function syncExistingAgents() {
  try {
    console.log('🔄 Syncing existing agents with Supabase Auth...\n')

    for (const [email, password] of Object.entries(agentPasswords)) {
      console.log(`Processing: ${email}`)

      try {
        // Check if agent exists in database
        const agent = await prisma.agent.findUnique({
          where: { email }
        })

        if (!agent) {
          console.log(`❌ Agent not found in database: ${email}`)
          continue
        }

        console.log(`✅ Agent found in database: ${agent.name}`)

        // Check if user already exists in Supabase Auth
        const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email)
        
        if (existingUser.user) {
          console.log(`✅ User already exists in Supabase Auth: ${existingUser.user.id}`)
          
          // Update agent record with existing Supabase user ID
          await prisma.agent.update({
            where: { id: agent.id },
            data: { id: existingUser.user.id }
          })
          
          console.log(`✅ Agent updated with existing Supabase user ID`)
          continue
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        })

        if (authError) {
          console.error(`❌ Error creating user for ${email}:`, authError.message)
          continue
        }

        console.log(`✅ User created in Supabase Auth: ${authData.user.id}`)

        // Update agent record with Supabase user ID
        await prisma.agent.update({
          where: { id: agent.id },
          data: { id: authData.user.id }
        })

        console.log(`✅ Agent updated with Supabase user ID`)

      } catch (error) {
        console.error(`❌ Error processing ${email}:`, error.message)
      }

      console.log('') // Empty line for readability
    }

    console.log('✅ Sync completed!')
    console.log('\n📝 Login Info:')
    console.log('- Use the email and password combinations defined in the script')
    console.log('- Make sure to update the password mapping in the script')

  } catch (error) {
    console.error('❌ Error syncing agents:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncExistingAgents()
