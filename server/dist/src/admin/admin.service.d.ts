import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    executeSql(query: string): Promise<any>;
    listTables(): Promise<any>;
    getBirthdays(): Promise<{
        name: string | null;
        role: string;
        img: string | null;
        isToday: boolean;
    }[]>;
    getWorkAnniversaries(): Promise<{
        name: string | null;
        role: string;
        img: string | null;
        date: string;
    }[]>;
    getNewHires(): Promise<{
        name: string | null;
        role: string;
        img: string | null;
        date: string;
    }[]>;
}
