
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Senha simples para teste: 123456
  const password = await bcrypt.hash('123456', 10)
  
  // Garantir que a role ADMIN existe (criada no seed)
  const adminRole = await prisma.role.findUnique({ 
    where: { name: 'ADMIN' } 
  })
  
  if (!adminRole) {
      console.error("❌ Erro: Role ADMIN não encontrada. Rode o seed primeiro.")
      return
  }

  try {
    const user = await prisma.user.create({
        data: {
        email: 'admin@teste.com',
        password,
        name: 'Admin Teste',
        roles: { connect: { id: adminRole.id } }, // Conecta ao cargo ADMIN existente
        profile: {
            create: {
                bio: 'Conta de teste criada manualmente',
                seniority: 'Senior',
                jobTitle: {
                    create: { name: "Test Admin", level: 10 }
                }
            }
        }
        }
    })
    console.log(`✅ Usuário criado com sucesso!`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`🔑 Senha: 123456`)
  } catch (e) {
      if (e.code === 'P2002') {
          console.log("⚠️ Usuário admin@teste.com já existe. Pode usar a senha '123456' se não tiver alterado.")
      } else {
          throw e
      }
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
