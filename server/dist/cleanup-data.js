"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🧹 Clearing all simulated analytics data...');
    await prisma.pageView.deleteMany({});
    await prisma.newsView.deleteMany({});
    await prisma.newsLike.deleteMany({});
    console.log('✨ Analytics tables cleared.');
    console.log('🎨 Updating company brand colors...');
    await prisma.companySettings.updateMany({
        data: {
            primaryColor: '#BFA15F',
            secondaryColor: '#1A2B4B'
        }
    });
    console.log('✅ Colors updated: Gold is now the Primary color.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=cleanup-data.js.map