"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordPageView(userId, pageUrl, pageName) {
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
        return views.map((v) => ({
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
            this.prisma.newsView.groupBy({ by: ['profileId'] }).then((res) => res.length),
            this.prisma.pageView.count(),
            this.prisma.pageView.groupBy({ by: ['userId'] }).then((res) => res.length),
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
            activeUsers: uniquePageUsers,
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
        return topPages.map((p) => ({
            url: p.pageUrl,
            name: p.pageName,
            count: p._count.id,
        }));
    }
    async getNewsRanking(page = 1, limit = 6, category) {
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
    async getAccessHistory(days = 7) {
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
        const dailyData = {};
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
        const monthly = {};
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map