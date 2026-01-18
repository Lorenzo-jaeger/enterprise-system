import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    executeSql(query: string): Promise<any>;
    listTables(): Promise<any>;
    getBirthdays(): Promise<any>;
}
