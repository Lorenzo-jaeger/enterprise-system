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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let NewsService = class NewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, search, category) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category && category !== 'Todos') {
            where.category = category;
        }
        const [items, total] = await Promise.all([
            this.prisma.news.findMany({
                where,
                skip,
                take: limit,
                orderBy: { publishDate: 'desc' },
                include: {
                    _count: {
                        select: { likes: true, views: true }
                    }
                }
            }),
            this.prisma.news.count({ where })
        ]);
        return {
            data: items.map(item => ({
                ...item,
                likes: item._count.likes,
                views: item._count.views
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id, userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (profile) {
            await this.prisma.newsView.create({
                data: {
                    newsId: id,
                    profileId: profile.id
                }
            });
        }
        const item = await this.prisma.news.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { likes: true, views: true }
                },
                likes: {
                    where: { profileId: profile?.id },
                }
            }
        });
        if (!item)
            return null;
        return {
            ...item,
            likes: item._count.likes,
            views: item._count.views,
            hasLiked: item.likes.length > 0
        };
    }
    async toggleLike(id, userId) {
        const profile = await this.prisma.profile.findUnique({ where: { userId } });
        if (!profile)
            throw new Error("Profile not found");
        const existingLike = await this.prisma.newsLike.findUnique({
            where: {
                newsId_profileId: {
                    newsId: id,
                    profileId: profile.id
                }
            }
        });
        if (existingLike) {
            await this.prisma.newsLike.delete({
                where: { id: existingLike.id }
            });
            return { liked: false };
        }
        else {
            await this.prisma.newsLike.create({
                data: {
                    newsId: id,
                    profileId: profile.id
                }
            });
            return { liked: true };
        }
    }
    async create(data) {
        return this.prisma.news.create({
            data
        });
    }
    async getMetrics() {
        const views = await this.prisma.newsView.findMany({
            orderBy: { viewedAt: 'desc' },
            include: {
                news: { select: { title: true, category: true } },
                profile: {
                    include: {
                        user: { select: { name: true, email: true } },
                        jobTitle: { select: { name: true } }
                    }
                }
            },
            take: 100
        });
        return views.map(v => ({
            id: v.id,
            newsTitle: v.news.title,
            newsCategory: v.news.category,
            userName: v.profile.user.name || v.profile.user.email,
            userRole: v.profile.jobTitle?.name || 'N/A',
            viewedAt: v.viewedAt
        }));
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsService);
//# sourceMappingURL=news.service.js.map