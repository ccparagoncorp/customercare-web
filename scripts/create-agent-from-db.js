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

async function createAgentFromDB() {
  try {
    // Get all agents from database
    const agents = await prisma.agent.findMany({
      where: { isActive: true }
    })

    console.log(`Found ${agents.length} agents in database`)

    for (const agent of agents) {
      console.log(`\nProcessing agent: ${agent.name} (${agent.email})`)

      try {
        // Check if user already exists in Supabase Auth
        const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(agent.email)
        
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

        // Create user in Supabase Auth (only if doesn't exist)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: agent.email,
          password: 'your-existing-password', // Ganti dengan password yang sudah Anda daftarkan
          email_confirm: true
        })

        if (authError) {
          console.error(`Error creating user for ${agent.email}:`, authError.message)
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
        console.error(`Error processing agent ${agent.email}:`, error.message)
      }
    }

    console.log('\n✅ Setup completed!')
    console.log('\nNote: Password sesuai dengan yang sudah Anda daftarkan di Supabase Auth')
    console.log('Pastikan password di script sesuai dengan yang sudah ada.')

  } catch (error) {
    console.error('Error setting up agents:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAgentFromDB()
