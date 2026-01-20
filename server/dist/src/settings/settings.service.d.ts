import { PrismaService } from '../prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        companyName: string;
        slogan: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        website: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSettings(updateDto: UpdateSettingsDto): Promise<{
        id: string;
        companyName: string;
        slogan: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        website: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLogo(logoUrl: string): Promise<{
        id: string;
        companyName: string;
        slogan: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        website: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
