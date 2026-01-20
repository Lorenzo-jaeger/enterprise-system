
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        // We assume there's always at least one row from seeding.
        // If multiple, we take the first one.
        const settings = await this.prisma.companySettings.findFirst();
        if (!settings) {
            // Fallback or create default if missing (should not happen with seed)
            return this.prisma.companySettings.create({
                data: {
                    companyName: 'Default Company',
                    primaryColor: '#0f172a',
                    secondaryColor: '#f8fafc'
                }
            });
        }
        return settings;
    }

    async updateSettings(updateDto: UpdateSettingsDto) {
        const settings = await this.getSettings();

        return this.prisma.companySettings.update({
            where: { id: settings.id },
            data: updateDto,
        });
    }

    async updateLogo(logoUrl: string) {
        const settings = await this.getSettings();
        return this.prisma.companySettings.update({
            where: { id: settings.id },
            data: { logoUrl }
        });
    }
}
