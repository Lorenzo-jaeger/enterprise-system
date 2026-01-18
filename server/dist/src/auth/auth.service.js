"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma.service");
const mailer_1 = require("@nestjs-modules/mailer");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    mailService;
    constructor(usersService, jwtService, prisma, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
            roles: user.roles ? user.roles.map((r) => r.name) : []
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return { message: 'If the email exists, a reset link has been sent.' };
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry: expiry,
            },
        });
        const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;
        await this.mailService.sendMail({
            to: email,
            subject: 'Recuperação de Senha - Enterprise System',
            html: `
        <h3>Olá, ${user.name || 'Usuário'}</h3>
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
        <p><a href="${resetLink}">Redefinir Minha Senha</a></p>
        <br>
        <p>Se você não solicitou isso, apenas ignore este email.</p>
      `,
        });
        return { message: 'If the email exists, a reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return { message: 'Password successfully updated.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map