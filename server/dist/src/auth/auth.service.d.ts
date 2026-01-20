import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    private mailService;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService, mailService: MailerService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
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
        jobTitle: string | null;
        branch: string | null;
        phone: string | null;
        certifications: string | null;
        avatarUrl: string | null;
        signatureBackgroundUrl: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
