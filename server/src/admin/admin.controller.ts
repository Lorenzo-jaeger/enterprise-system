import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('sql')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Execute raw SQL (Admin only)' })
  async executeSql(@Body() body: { query: string }) {
    return this.adminService.executeSql(body.query);
  }

  @Get('tables')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List database tables (Admin only)' })
  async listTables() {
    return this.adminService.listTables();
  }

  @Get('birthdays')
  @Roles('ADMIN', 'MANAGER', 'USER') // All auth users can see birthdays
  @ApiOperation({ summary: 'Get birthdays of the day' })
  async getBirthdays() {
      return this.adminService.getBirthdays();
  }

  @Get('anniversaries')
  @Roles('ADMIN', 'MANAGER', 'USER')
  @ApiOperation({ summary: 'Get work anniversaries of the day' })
  async getWorkAnniversaries() {
      return this.adminService.getWorkAnniversaries();
  }

  @Get('new-hires')
  @Roles('ADMIN', 'MANAGER', 'USER')
  @ApiOperation({ summary: 'Get new hires (last 30 days)' })
  async getNewHires() {
      return this.adminService.getNewHires();
  }
}
