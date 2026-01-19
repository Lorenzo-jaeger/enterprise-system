import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('news')
@Controller('news')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List news with pagination and filters' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.newsService.findAll(Number(page), Number(limit), search, category);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get news access logs' })
  async getMetrics() {
      return this.newsService.getMetrics();
  }

  @Post()
  @ApiOperation({ summary: 'Create news' })
  async create(@Body() body: any) {
      return this.newsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news details and record view' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    // req.user.userId is available from JwtStrategy (check auth module)
    // Actually typically req.user is the payload. Let's assume req.user.id or sub.
    // In admin.service we used admin endpoints.
    // Auth guard usually populates req.user.
    return this.newsService.findOne(id, req.user.userId || req.user.id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Toggle like' })
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.newsService.toggleLike(id, req.user.userId || req.user.id);
  }
}
