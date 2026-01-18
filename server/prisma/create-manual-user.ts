import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'lorenzobraga1@gmail.com';
  const password = 'Fami@2025';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
        email,
        password: hashedPassword,
        name: 'Lorenzo Braga',
        roles: {
            connectOrCreate: {
                where: { name: 'ADMIN' },
                create: { name: 'ADMIN' }
            }
        }
    },
  });
  console.log('User created/updated:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
