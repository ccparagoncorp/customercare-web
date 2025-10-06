import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD
    const superAdminName = process.env.SUPER_ADMIN_NAME
    
    try {
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true,
        user_metadata: {
          name: superAdminName,
          role: 'SUPER_ADMIN'
        }
      })

      if (authError) {
        console.log('ℹ️ Auth user already exists or error:', authError.message)
      } else {
        console.log('✅ Super admin auth user created:', authUser.user?.email)
      }

      // Create super admin in database
      if (authUser?.user) {
        try {
          const superAdmin = await prisma.user.create({
            data: {
              id: authUser.user.id,
              email: superAdminEmail,
              role: 'SUPER_ADMIN',
            },
          })
          console.log('✅ Super admin database user created:', superAdmin.email)
        } catch (dbError) {
          console.log('ℹ️ Super admin database user already exists')
        }
      }
    } catch (error) {
      console.log('ℹ️ Auth user creation skipped (may already exist)')
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 