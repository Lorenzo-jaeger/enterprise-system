import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async executeSql(query: string) {
        // SECURITY WARNING: This allows arbitrary SQL execution. 
        // Intended for Admin SQL Playground feature only.
        try {
            const result = await this.prisma.$queryRawUnsafe(query);
            // Serialize BigInt if present (common in SQL results)
            return JSON.parse(JSON.stringify(result, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value // return everything else unchanged
            ));
        } catch (error) {
            return { error: error.message };
        }
    }

    async listTables() {
        // SQLite specific
        const query = `SELECT name as table_name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%';`;
        try {
            const result: any = await this.prisma.$queryRawUnsafe(query);
            return result.map((row: any) => row.table_name);
        } catch (e) {
            return [];
        }
    }

    async getBirthdays() {
        const today = new Date();
        const profiles = await this.prisma.profile.findMany({
            where: { birthday: { not: null } },
            include: { user: true, jobTitle: true }
        });

        // Filter in JS
        const upcoming = profiles.filter(p => {
            if (!p.birthday) return false;
            const bday = new Date(p.birthday);
            return bday.getMonth() === today.getMonth() &&
                (bday.getDate() === today.getDate() || bday.getDate() === today.getDate() + 1);
        });

        return upcoming.map((p) => ({
            name: p.user.name,
            role: p.jobTitle?.name || 'Employee',
            img: p.avatarUrl,
            isToday: new Date(p.birthday!).getDate() === today.getDate()
        }));
    }

    async getWorkAnniversaries() {
        const today = new Date();
        const profiles = await this.prisma.profile.findMany({
            where: { joinedAt: { not: null } },
            include: { user: true, jobTitle: true }
        });

        const anns = profiles.filter(p => {
            if (!p.joinedAt) return false;
            const joinDate = new Date(p.joinedAt);
            return joinDate.getMonth() === today.getMonth() &&
                joinDate.getDate() === today.getDate() &&
                joinDate.getFullYear() < today.getFullYear();
        });

        return anns.map((p) => {
            const joinedYear = new Date(p.joinedAt!).getFullYear();
            const currentYear = today.getFullYear();
            const years = currentYear - joinedYear;
            return {
                name: p.user.name,
                role: `${years} Ano${years > 1 ? 's' : ''} de Casa`,
                img: p.avatarUrl,
                date: "Hoje"
            };
        });
    }

    async getNewHires() {
        // Find people joined in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await this.prisma.profile.findMany({
            where: {
                joinedAt: {
                    gte: thirtyDaysAgo
                }
            },
            include: {
                user: true,
                jobTitle: true,
                department: true
            },
            orderBy: {
                joinedAt: 'desc'
            },
            take: 5
        });

        return result.map(p => {
            const daysAgo = Math.floor((new Date().getTime() - new Date(p.joinedAt!).getTime()) / (1000 * 3600 * 24));
            return {
                name: p.user.name,
                role: p.jobTitle?.name || 'Novo Colaborador',
                img: p.avatarUrl,
                date: daysAgo === 0 ? "Entrou Hoje" : daysAgo === 1 ? "Entrou Ontem" : `Há ${daysAgo} dias`
            };
        });
    }
}
