import { PrismaService } from '../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    recordPageView(userId: string, pageUrl: string, pageName?: string): Promise<{
        id: string;
        pageUrl: string;
        pageName: string | null;
        userId: string;
        viewedAt: Date;
    }>;
    getPageMetrics(): Promise<{
        id: any;
        pageUrl: any;
        pageName: any;
        userName: any;
        viewedAt: any;
    }[]>;
    getDashboardStats(): Promise<{
        newsViews: number;
        uniqueNewsUsers: number;
        pageViews: number;
        uniquePageUsers: number;
        totalLikes: number;
        totalUsers: number;
        activeUsers: number;
        disabledUsers: number;
    }>;
    getTopPages(): Promise<{
        url: any;
        name: any;
        count: any;
    }[]>;
    getNewsRanking(page?: number, limit?: number, category?: string): Promise<{
        items: {
            id: string;
            title: string;
            category: string;
            views: number;
            likes: number;
        }[];
        total: number;
        pages: number;
    }>;
    getAccessHistory(days?: number): Promise<{
        date: string;
        pageViews: number;
    }[]>;
    getMonthlyMetrics(): Promise<{
        month: string;
        accesses: number;
        uniqueAccesses: number;
    }[]>;
}
