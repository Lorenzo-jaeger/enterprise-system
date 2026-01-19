import { NewsService } from './news.service';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    findAll(page?: number, limit?: number, search?: string, category?: string): Promise<{
        data: {
            likes: number;
            views: number;
            _count: {
                likes: number;
                views: number;
            };
            id: string;
            title: string;
            summary: string;
            content: string;
            image: string | null;
            category: string;
            publishDate: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getMetrics(): Promise<{
        id: string;
        newsTitle: string;
        newsCategory: string;
        userName: string;
        userRole: string;
        viewedAt: Date;
    }[]>;
    create(body: any): Promise<{
        id: string;
        title: string;
        summary: string;
        content: string;
        image: string | null;
        category: string;
        publishDate: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string, req: any): Promise<{
        likes: number;
        views: number;
        hasLiked: boolean;
        _count: {
            likes: number;
            views: number;
        };
        id: string;
        title: string;
        summary: string;
        content: string;
        image: string | null;
        category: string;
        publishDate: Date;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    toggleLike(id: string, req: any): Promise<{
        liked: boolean;
    }>;
}
