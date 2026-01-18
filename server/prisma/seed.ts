import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'System Administrator',
      permissions: {
        create: [
            { action: 'users:manage' },
            { action: 'system:config' }
        ]
      }
    },
  })

  // Create User
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@enterprise.com' },
    update: {},
    create: {
      email: 'admin@enterprise.com',
      name: 'Admin User',
      password: hashedPassword,
      roles: {
        connect: { id: adminRole.id }
      },
      profile: {
        create: {
          bio: 'System Administrator',
        }
      }
    }
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
