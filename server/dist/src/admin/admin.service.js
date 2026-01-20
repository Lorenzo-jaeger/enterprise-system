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
        const query = `SELECT name as table_name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%';`;
        try {
            const result = await this.prisma.$queryRawUnsafe(query);
            return result.map((row) => row.table_name);
        }
        catch (e) {
            return [];
        }
    }
    async getBirthdays() {
        const today = new Date();
        const profiles = await this.prisma.profile.findMany({
            where: { birthday: { not: null } },
            include: { user: true, jobTitle: true }
        });
        const upcoming = profiles.filter(p => {
            if (!p.birthday)
                return false;
            const bday = new Date(p.birthday);
            return bday.getMonth() === today.getMonth() &&
                (bday.getDate() === today.getDate() || bday.getDate() === today.getDate() + 1);
        });
        return upcoming.map((p) => ({
            name: p.user.name,
            role: p.jobTitle?.name || 'Employee',
            img: p.avatarUrl,
            isToday: new Date(p.birthday).getDate() === today.getDate()
        }));
    }
    async getWorkAnniversaries() {
        const today = new Date();
        const profiles = await this.prisma.profile.findMany({
            where: { joinedAt: { not: null } },
            include: { user: true, jobTitle: true }
        });
        const anns = profiles.filter(p => {
            if (!p.joinedAt)
                return false;
            const joinDate = new Date(p.joinedAt);
            return joinDate.getMonth() === today.getMonth() &&
                joinDate.getDate() === today.getDate() &&
                joinDate.getFullYear() < today.getFullYear();
        });
        return anns.map((p) => {
            const joinedYear = new Date(p.joinedAt).getFullYear();
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