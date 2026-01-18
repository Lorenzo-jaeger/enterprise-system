import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        roles: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        email: string;
        password: string;
        name: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
}
