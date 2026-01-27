"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('📊 Seeding REAL Analytics Data (Lower numbers for accuracy)...');
    const users = await prisma.user.findMany({ include: { profile: true } });
    const news = await prisma.news.findMany();
    if (users.length === 0 || news.length === 0) {
        console.error('❌ No users or news found.');
        return;
    }
    await prisma.pageView.deleteMany({});
    await prisma.newsView.deleteMany({});
    await prisma.newsLike.deleteMany({});
    const pages = [
        { url: '/admin', name: 'Dashboard' },
        { url: '/admin/news', name: 'Gestão de Notícias' },
        { url: '/admin/analytics', name: 'Métricas' },
        { url: '/', name: 'Página Inicial' }
    ];
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
        const accessCount = Math.floor(Math.random() * 40) + 25;
        for (let i = 0; i < accessCount; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const page = pages[Math.floor(Math.random() * pages.length)];
            const date = new Date();
            date.setMonth(date.getMonth() - monthOffset);
            date.setDate(Math.floor(Math.random() * 28) + 1);
            await prisma.pageView.create({
                data: {
                    userId: user.id,
                    pageUrl: page.url,
                    pageName: page.name,
                    viewedAt: date
                }
            });
        }
    }
    for (let i = 0; i < 50; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const item = news[Math.floor(Math.random() * news.length)];
        if (user.profile) {
            if (Math.random() > 0.6) {
                try {
                    await prisma.newsLike.create({
                        data: {
                            newsId: item.id,
                            profileId: user.profile.id,
                        }
                    });
                }
                catch (e) { }
            }
            await prisma.newsView.create({
                data: {
                    newsId: item.id,
                    profileId: user.profile.id,
                    viewedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
                }
            });
        }
    }
    console.log('✅ Accurate data seeded (Realistic lower volume).');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-metrics.js.map