import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    recordPageView(body: {
        pageUrl: string;
        pageName?: string;
    }, req: any): Promise<{
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
    getHistory(days?: number): Promise<{
        date: string;
        pageViews: number;
    }[]>;
    getMonthlyMetrics(): Promise<{
        month: string;
        accesses: number;
        uniqueAccesses: number;
    }[]>;
    getStats(): Promise<{
        newsViews: number;
        uniqueNewsUsers: number;
        pageViews: number;
        uniquePageUsers: number;
        totalLikes: number;
        totalUsers: number;
        activeUsers: number;
        disabledUsers: number;
    }>;
}
