import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    update(updateSettingsDto: UpdateSettingsDto): Promise<{
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
    uploadLogo(file: Express.Multer.File): Promise<{
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
