import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async recordPageView(userId: string, pageUrl: string, pageName?: string) {
        return this.prisma.pageView.create({
            data: {
                userId,
                pageUrl,
                pageName,
            },
        });
    }

    async getPageMetrics() {
        const views = await this.prisma.pageView.findMany({
            orderBy: { viewedAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
            },
            take: 200,
        });

        return views.map((v: any) => ({
            id: v.id,
            pageUrl: v.pageUrl,
            pageName: v.pageName,
            userName: v.user.name || v.user.email,
            viewedAt: v.viewedAt,
        }));
    }

    async getDashboardStats() {
        const [newsViews, uniqueNewsUsers, pageViews, uniquePageUsers, totalLikes, totalUsers] = await Promise.all([
            this.prisma.newsView.count(),
            this.prisma.newsView.groupBy({ by: ['profileId'] }).then((res: any[]) => res.length),
            this.prisma.pageView.count(),
            this.prisma.pageView.groupBy({ by: ['userId'] }).then((res: any[]) => res.length),
            this.prisma.newsLike.count(),
            this.prisma.user.count(),
        ]);

        return {
            newsViews,
            uniqueNewsUsers,
            pageViews,
            uniquePageUsers,
            totalLikes,
            totalUsers,
            activeUsers: uniquePageUsers, // Using uniquePageUsers as Active Users for the demo
            disabledUsers: Math.max(0, totalUsers - uniquePageUsers),
        };
    }

    async getTopPages() {
        const topPages = await this.prisma.pageView.groupBy({
            by: ['pageUrl', 'pageName'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 10,
        });

        return topPages.map((p: any) => ({
            url: p.pageUrl,
            name: p.pageName,
            count: p._count.id,
        }));
    }

    async getNewsRanking(page: number = 1, limit: number = 6, category?: string) {
        const skip = (page - 1) * limit;
        const where = category && category !== 'all' ? { category } : {};

        const [newsRanking, total] = await Promise.all([
            this.prisma.news.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    category: true,
                    _count: {
                        select: {
                            views: true,
                            likes: true,
                        },
                    },
                },
                orderBy: {
                    views: {
                        _count: 'desc',
                    },
                },
                skip,
                take: limit,
            }),
            this.prisma.news.count({ where })
        ]);

        return {
            items: newsRanking.map((n) => ({
                id: n.id,
                title: n.title,
                category: n.category,
                views: n._count.views,
                likes: n._count.likes,
            })),
            total,
            pages: Math.ceil(total / limit)
        };
    }

    async getAccessHistory(days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const views = await this.prisma.pageView.findMany({
            where: {
                viewedAt: {
                    gte: startDate,
                },
            },
            select: {
                viewedAt: true,
            },
        });

        const dailyData: Record<string, { date: string, pageViews: number }> = {};
        for (let i = 0; i <= days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            dailyData[key] = { date: key, pageViews: 0 };
        }

        views.forEach((v) => {
            const key = v.viewedAt.toISOString().split('T')[0];
            if (dailyData[key]) {
                dailyData[key].pageViews++;
            }
        });

        return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    }

    async getMonthlyMetrics() {
        const views = await this.prisma.pageView.findMany({
            select: { viewedAt: true, userId: true }
        });

        const monthly: Record<string, { month: string, accesses: number, uniqueUsers: Set<string> }> = {};

        views.forEach(v => {
            const date = new Date(v.viewedAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthly[key]) {
                monthly[key] = { month: key, accesses: 0, uniqueUsers: new Set() };
            }
            monthly[key].accesses++;
            monthly[key].uniqueUsers.add(v.userId);
        });

        return Object.values(monthly).map(m => ({
            month: m.month,
            accesses: m.accesses,
            uniqueAccesses: m.uniqueUsers.size
        })).sort((a, b) => b.month.localeCompare(a.month));
    }
}
