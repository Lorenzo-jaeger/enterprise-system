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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'System Administrator',
            permissions: {
                create: [
                    { action: 'users:manage' },
                    { action: 'system:config' }
                ]
            }
        },
    });
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@enterprise.com' },
        update: {},
        create: {
            email: 'admin@enterprise.com',
            name: 'Admin User',
            password: hashedPassword,
            roles: {
                connect: { id: adminRole.id }
            },
            profile: {
                create: {
                    bio: 'System Administrator',
                }
            }
        }
    });
    const managerRole = await prisma.role.upsert({
        where: { name: 'MANAGER' },
        update: {},
        create: {
            name: 'MANAGER',
            description: 'Dashboard Manager',
            permissions: {
                create: [
                    { action: 'dashboard:view' },
                    { action: 'reports:read' },
                    { action: 'users:read' }
                ]
            }
        },
    });
    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@enterprise.com' },
        update: {},
        create: {
            email: 'manager@enterprise.com',
            name: 'Manager Dash',
            password: hashedPassword,
            roles: {
                connect: { id: managerRole.id }
            },
            profile: {
                create: {
                    bio: 'Dashboard Supervisor',
                    avatarUrl: 'https://i.pravatar.cc/150?u=manager'
                }
            }
        }
    });
    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
            description: 'End User',
            permissions: {
                create: [
                    { action: 'profile:read' },
                    { action: 'profile:update' },
                    { action: 'tasks:read' }
                ]
            }
        },
    });
    const finalUser = await prisma.user.upsert({
        where: { email: 'user@enterprise.com' },
        update: {},
        create: {
            email: 'user@enterprise.com',
            name: 'Usuario Final',
            password: hashedPassword,
            roles: {
                connect: { id: userRole.id }
            },
            profile: {
                create: {
                    bio: 'Standard User',
                    avatarUrl: 'https://i.pravatar.cc/150?u=user'
                }
            }
        }
    });
    const birthdayToday = await prisma.user.upsert({
        where: { email: 'birthday@enterprise.com' },
        update: {
            profile: {
                update: {
                    birthday: new Date()
                }
            }
        },
        create: {
            email: 'birthday@enterprise.com',
            name: 'Aniversariante do Dia',
            password: hashedPassword,
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Happy Birthday!',
                    birthday: new Date(),
                    avatarUrl: 'https://i.pravatar.cc/150?u=bday'
                }
            }
        }
    });
    const birthdayTomorrow = await prisma.user.upsert({
        where: { email: 'tomorrow@enterprise.com' },
        update: {
            profile: {
                update: {
                    birthday: new Date(new Date().setDate(new Date().getDate() + 1))
                }
            }
        },
        create: {
            email: 'tomorrow@enterprise.com',
            name: 'Aniversariante de Amanhã',
            password: hashedPassword,
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Almost there!',
                    birthday: new Date(new Date().setDate(new Date().getDate() + 1)),
                    avatarUrl: 'https://i.pravatar.cc/150?u=tmrw'
                }
            }
        }
    });
    console.log({ admin: user, manager: managerUser, user: finalUser });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map