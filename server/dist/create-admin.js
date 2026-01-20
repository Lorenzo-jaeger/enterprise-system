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
    const password = await bcrypt.hash('123456', 10);
    const adminRole = await prisma.role.findUnique({
        where: { name: 'ADMIN' }
    });
    if (!adminRole) {
        console.error("❌ Erro: Role ADMIN não encontrada. Rode o seed primeiro.");
        return;
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: 'admin@teste.com',
                password,
                name: 'Admin Teste',
                roles: { connect: { id: adminRole.id } },
                profile: {
                    create: {
                        bio: 'Conta de teste criada manualmente',
                        seniority: 'Senior',
                        jobTitle: {
                            create: { name: "Test Admin", level: 10 }
                        }
                    }
                }
            }
        });
        console.log(`✅ Usuário criado com sucesso!`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Senha: 123456`);
    }
    catch (e) {
        if (e.code === 'P2002') {
            console.log("⚠️ Usuário admin@teste.com já existe. Pode usar a senha '123456' se não tiver alterado.");
        }
        else {
            throw e;
        }
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=create-admin.js.map