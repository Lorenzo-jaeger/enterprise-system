import { PrismaService } from '../prisma.service';
export declare class NewsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: string, userId: string): Promise<{
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
    toggleLike(id: string, userId: string): Promise<{
        liked: boolean;
    }>;
    create(data: {
        title: string;
        summary: string;
        content: string;
        image?: string;
        category: string;
    }): Promise<{
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
    getMetrics(): Promise<{
        id: string;
        newsTitle: string;
        newsCategory: string;
        userName: string;
        userRole: string;
        viewedAt: Date;
    }[]>;
}
