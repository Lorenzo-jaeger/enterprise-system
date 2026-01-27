
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Clearing all simulated analytics data...')

    // Clear all tracking tables to leave only real data
    await prisma.pageView.deleteMany({});
    await prisma.newsView.deleteMany({});
    await prisma.newsLike.deleteMany({});

    console.log('✨ Analytics tables cleared.')

    console.log('🎨 Updating company brand colors...')
    // Update FAMI Capital colors: Primary = Gold (#BFA15F), Secondary = Navy (#1A2B4B)
    await prisma.companySettings.updateMany({
        data: {
            primaryColor: '#BFA15F',
            secondaryColor: '#1A2B4B'
        }
    });

    console.log('✅ Colors updated: Gold is now the Primary color.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
