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

  // === ROLE: MANAGER ===
  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      description: 'Dashboard Manager',
      permissions: {
        create: [
            { action: 'dashboard:view' },
            { action: 'reports:read' },
            { action: 'users:read' }
        ]
      }
    },
  })

  // User: Manager
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@enterprise.com' },
    update: {},
    create: {
      email: 'manager@enterprise.com',
      name: 'Manager Dash',
      password: hashedPassword,
      roles: {
        connect: { id: managerRole.id }
      },
      profile: {
        create: {
          bio: 'Dashboard Supervisor',
          avatarUrl: 'https://i.pravatar.cc/150?u=manager'
        }
      }
    }
  })

  // === ROLE: USER (Final) ===
  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'End User',
      permissions: {
        create: [
            { action: 'profile:read' },
            { action: 'profile:update' },
            { action: 'tasks:read' }
        ]
      }
    },
  })

  // User: Final User
  const finalUser = await prisma.user.upsert({
    where: { email: 'user@enterprise.com' },
    update: {},
    create: {
      email: 'user@enterprise.com',
      name: 'Usuario Final',
      password: hashedPassword,
      roles: {
        connect: { id: userRole.id }
      },
      profile: {
        create: {
          bio: 'Standard User',
          avatarUrl: 'https://i.pravatar.cc/150?u=user'
        }
      }
    }
  })

  // === Birthday Users ===
  const birthdayToday = await prisma.user.upsert({
      where: { email: 'birthday@enterprise.com' },
      update: {
          profile: {
              update: {
                  birthday: new Date() // Today
              }
          }
      },
      create: {
          email: 'birthday@enterprise.com',
          name: 'Aniversariante do Dia',
          password: hashedPassword,
          roles: { connect: { id: userRole.id } },
          profile: {
              create: {
                  bio: 'Happy Birthday!',
                  birthday: new Date(),
                  avatarUrl: 'https://i.pravatar.cc/150?u=bday'
              }
          }
      }
  })

  const birthdayTomorrow = await prisma.user.upsert({
    where: { email: 'tomorrow@enterprise.com' },
    update: {
        profile: {
            update: {
                birthday: new Date(new Date().setDate(new Date().getDate() + 1)) 
            }
        }
    },
    create: {
        email: 'tomorrow@enterprise.com',
        name: 'Aniversariante de Amanhã',
        password: hashedPassword,
        roles: { connect: { id: userRole.id } },
        profile: {
            create: {
                bio: 'Almost there!',
                birthday: new Date(new Date().setDate(new Date().getDate() + 1)),
                avatarUrl: 'https://i.pravatar.cc/150?u=tmrw'
            }
        }
    }
})

  console.log({ admin: user, manager: managerUser, user: finalUser })
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
