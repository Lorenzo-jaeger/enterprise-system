import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post('page-view')
    @ApiOperation({ summary: 'Record a page view' })
    async recordPageView(@Body() body: { pageUrl: string; pageName?: string }, @Request() req: any) {
        return this.analyticsService.recordPageView(req.user.userId || req.user.id, body.pageUrl, body.pageName);
    }

    @Get('page-metrics')
    @ApiOperation({ summary: 'Get page view logs' })
    async getPageMetrics() {
        return this.analyticsService.getPageMetrics();
    }

    @Get('top-pages')
    @ApiOperation({ summary: 'Get most visited pages' })
    async getTopPages() {
        return this.analyticsService.getTopPages();
    }

    @Get('news-ranking')
    @ApiOperation({ summary: 'Get news ranking by views and likes' })
    async getNewsRanking(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('category') category?: string
    ) {
        return this.analyticsService.getNewsRanking(
            page ? Number(page) : 1,
            limit ? Number(limit) : 6,
            category
        );
    }

    @Get('history')
    @ApiOperation({ summary: 'Get access history for charts' })
    async getHistory(@Query('days') days?: number) {
        return this.analyticsService.getAccessHistory(days ? Number(days) : 7);
    }

    @Get('monthly-metrics')
    @ApiOperation({ summary: 'Get monthly access metrics' })
    async getMonthlyMetrics() {
        return this.analyticsService.getMonthlyMetrics();
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get global analytics stats' })
    async getStats() {
        return this.analyticsService.getDashboardStats();
    }
}
