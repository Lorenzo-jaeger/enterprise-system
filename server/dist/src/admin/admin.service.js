"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async executeSql(query) {
        try {
            const result = await this.prisma.$queryRawUnsafe(query);
            return JSON.parse(JSON.stringify(result, (key, value) => typeof value === 'bigint'
                ? value.toString()
                : value));
        }
        catch (error) {
            return { error: error.message };
        }
    }
    async listTables() {
        const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
        const result = await this.prisma.$queryRawUnsafe(query);
        return result.map((row) => row.table_name);
    }
    async getBirthdays() {
        const query = `
        SELECT u.name, p."avatarUrl", p.bio, p.birthday, jt.name as "jobTitle"
        FROM "User" u
        JOIN "Profile" p ON u.id = p."userId"
        LEFT JOIN "JobTitle" jt ON p."jobTitleId" = jt.id
        WHERE 
            EXTRACT(MONTH FROM p.birthday) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND (
                EXTRACT(DAY FROM p.birthday) = EXTRACT(DAY FROM CURRENT_DATE)
                OR EXTRACT(DAY FROM p.birthday) = EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '1 day')
            )
        LIMIT 10;
      `;
        const result = await this.prisma.$queryRawUnsafe(query);
        return result.map((r) => ({
            name: r.name,
            role: r.jobTitle || r.bio || 'Employee',
            img: r.avatarUrl,
            isToday: new Date(r.birthday).getDate() === new Date().getDate()
        }));
    }
    async getWorkAnniversaries() {
        const query = `
        SELECT u.name, p."avatarUrl", p."joinedAt", jt.name as "jobTitle"
        FROM "User" u
        JOIN "Profile" p ON u.id = p."userId"
        LEFT JOIN "JobTitle" jt ON p."jobTitleId" = jt.id
        WHERE 
            p."joinedAt" IS NOT NULL
            AND EXTRACT(MONTH FROM p."joinedAt") = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(DAY FROM p."joinedAt") = EXTRACT(DAY FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM p."joinedAt") < EXTRACT(YEAR FROM CURRENT_DATE)
        LIMIT 10;
      `;
        const result = await this.prisma.$queryRawUnsafe(query);
        return result.map((r) => {
            const joinedYear = new Date(r.joinedAt).getFullYear();
            const currentYear = new Date().getFullYear();
            const years = currentYear - joinedYear;
            return {
                name: r.name,
                role: `${years} Ano${years > 1 ? 's' : ''} de Casa`,
                img: r.avatarUrl,
                date: "Hoje"
            };
        });
    }
    async getNewHires() {
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
            const daysAgo = Math.floor((new Date().getTime() - new Date(p.joinedAt).getTime()) / (1000 * 3600 * 24));
            return {
                name: p.user.name,
                role: p.jobTitle?.name || 'Novo Colaborador',
                img: p.avatarUrl,
                date: daysAgo === 0 ? "Entrou Hoje" : daysAgo === 1 ? "Entrou Ontem" : `Há ${daysAgo} dias`
            };
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map