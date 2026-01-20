import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    executeSql(body: {
        query: string;
    }): Promise<any>;
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
