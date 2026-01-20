
import { Controller, Get, Body, Patch, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Helper for file upload naming
const editFileName = (req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    update(@Body() updateSettingsDto: UpdateSettingsDto) {
        return this.settingsService.updateSettings(updateSettingsDto);
    }

    @Post('upload-logo')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads', // Ensure this exists or map to a static folder
                filename: editFileName,
            }),
        }),
    )
    uploadLogo(@UploadedFile() file: Express.Multer.File) {
        // For now, assuming we serve static files from /uploads
        // We might need to configure ServeStaticModule in AppModule
        // Or just return the filename to debugging
        // Let's assume a simple static serve setup 
        const fileUrl = `/uploads/${file.filename}`;
        return this.settingsService.updateLogo(fileUrl);
    }
}
