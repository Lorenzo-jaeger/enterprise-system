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
}
