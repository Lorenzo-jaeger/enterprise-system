import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    executeSql(body: {
        query: string;
    }): Promise<any>;
    listTables(): Promise<any>;
    getBirthdays(): Promise<any>;
    getWorkAnniversaries(): Promise<any>;
    getNewHires(): Promise<{
        name: string | null;
        role: string;
        img: string | null;
        date: string;
    }[]>;
}
