import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
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

  async findOne(id: string, userId: string) {
    // Record view
    // Check if view exists to avoid spamming usage (optional, but user asked for "metrics")
    // Let's just create a view record every time for now as per "traquear visualizacoes"
    // But maybe debounce? simple approach: create.
    
    // We need profileId to satisfy schema.
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
            where: { profileId: profile?.id }, // check if THIS user liked
        }
      }
    });

    if (!item) return null;

    return {
      ...item,
      likes: item._count.likes,
      views: item._count.views,
      hasLiked: item.likes.length > 0
    };
  }

  async toggleLike(id: string, userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Profile not found");

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
    } else {
      await this.prisma.newsLike.create({
        data: {
          newsId: id,
          profileId: profile.id
        }
      });
      return { liked: true };
    }
  }

  async create(data: { title: string; summary: string; content: string; image?: string; category: string }) {
    return this.prisma.news.create({
      data
    });
  }

  async getMetrics() {
    // Return list of all views, ordered by date desc
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
        take: 100 // Limit to last 100 for now
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
}
