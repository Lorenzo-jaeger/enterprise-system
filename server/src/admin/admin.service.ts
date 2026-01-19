import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const result: any = await this.prisma.$queryRawUnsafe(query);
    return result.map((row: any) => row.table_name);
  }

  async getBirthdays() {
      // Prisma doesn't support easy month/day filtering across years without raw SQL or computed columns
      // Using Raw SQL for PostgreSQL
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
      
      const result: any = await this.prisma.$queryRawUnsafe(query);
      return result.map((r: any) => ({
          name: r.name,
          role: r.jobTitle || r.bio || 'Employee',
          img: r.avatarUrl,
          isToday: new Date(r.birthday).getDate() === new Date().getDate()
      }));
  }

  async getWorkAnniversaries() {
      // Find people who joined on this day/month in past years
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

      const result: any = await this.prisma.$queryRawUnsafe(query);
      return result.map((r: any) => {
          const joinedYear = new Date(r.joinedAt).getFullYear();
          const currentYear = new Date().getFullYear();
          const years = currentYear - joinedYear;
          return {
              name: r.name,
              role: `${years} Ano${years > 1 ? 's' : ''} de Casa`, // Display text for the UI
              img: r.avatarUrl,
              date: "Hoje" // For simplicity in this widget context
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
