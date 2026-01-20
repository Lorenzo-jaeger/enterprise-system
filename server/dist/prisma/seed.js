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
    console.log('🌱 Starting seed...');
    await prisma.auditLog.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.jobTitle.deleteMany();
    await prisma.department.deleteMany();
    await prisma.role.deleteMany();
    const adminRole = await prisma.role.create({ data: { name: 'ADMIN', description: 'Administrator' } });
    const userRole = await prisma.role.create({ data: { name: 'USER', description: 'Regular User' } });
    const techArea = await prisma.department.create({
        data: { name: 'Technology', description: 'Tech Area' }
    });
    const techOpsTeam = await prisma.department.create({
        data: { name: 'TechOps', parentId: techArea.id }
    });
    const infraSecArea = await prisma.department.create({
        data: { name: 'Infra & Security', parentId: techArea.id }
    });
    const supportTeam = await prisma.department.create({
        data: { name: 'Support', parentId: infraSecArea.id }
    });
    const governanceTeam = await prisma.department.create({
        data: { name: 'Governance', parentId: infraSecArea.id }
    });
    const headTitle = await prisma.jobTitle.create({ data: { name: 'Head', level: 10 } });
    const specialistTitle = await prisma.jobTitle.create({ data: { name: 'Specialist', level: 8 } });
    const seniorTitle = await prisma.jobTitle.create({ data: { name: 'Senior Developer', level: 6 } });
    const fullTitle = await prisma.jobTitle.create({ data: { name: 'Full Developer', level: 5 } });
    const juniorTitle = await prisma.jobTitle.create({ data: { name: 'Junior Developer', level: 3 } });
    const internTitle = await prisma.jobTitle.create({ data: { name: 'Intern', level: 1 } });
    const supportLeaderTitle = await prisma.jobTitle.create({ data: { name: 'Support Leader', level: 7 } });
    const password = await bcrypt.hash('password123', 10);
    const getProfileId = async (userId) => {
        const p = await prisma.profile.findUnique({ where: { userId } });
        return p?.id;
    };
    const headTechOps = await prisma.user.create({
        data: {
            email: 'alex.techops@enterprise.com',
            password,
            name: 'Alex Rivera',
            roles: { connect: { id: adminRole.id } },
            profile: {
                create: {
                    bio: 'Head of TechOps',
                    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
                    birthday: new Date('1985-05-20'),
                    joinedAt: new Date('2020-03-10'),
                    seniority: 'Head',
                    departmentId: techOpsTeam.id,
                    jobTitleId: headTitle.id,
                }
            }
        }
    });
    const headTechOpsProfileId = await getProfileId(headTechOps.id);
    const dev1 = await prisma.user.create({
        data: {
            email: 'dev1@enterprise.com',
            password,
            name: 'Sarah Code',
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Senior Dev',
                    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
                    birthday: new Date('1992-08-15'),
                    joinedAt: new Date('2021-06-01'),
                    seniority: 'Senior',
                    departmentId: techOpsTeam.id,
                    jobTitleId: seniorTitle.id,
                    managerId: headTechOpsProfileId
                }
            }
        }
    });
    await prisma.user.create({
        data: {
            email: 'dev2@enterprise.com',
            password,
            name: 'Mike Junior',
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Junior Dev',
                    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
                    birthday: new Date('2000-01-10'),
                    joinedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
                    seniority: 'Junior',
                    departmentId: techOpsTeam.id,
                    jobTitleId: juniorTitle.id,
                    managerId: headTechOpsProfileId
                }
            }
        }
    });
    await prisma.user.create({
        data: {
            email: 'dev3@enterprise.com',
            password,
            name: 'Julia Anniversary',
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Full Dev',
                    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
                    birthday: new Date('1995-11-20'),
                    joinedAt: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
                    seniority: 'Full',
                    departmentId: techOpsTeam.id,
                    jobTitleId: fullTitle.id,
                    managerId: headTechOpsProfileId
                }
            }
        }
    });
    const headInfra = await prisma.user.create({
        data: {
            email: 'marcus.infra@enterprise.com',
            password,
            name: 'Marcus Security',
            roles: { connect: { id: adminRole.id } },
            profile: {
                create: {
                    bio: 'Head of Infra & Sec',
                    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                    birthday: new Date('1980-03-30'),
                    joinedAt: new Date('2018-01-20'),
                    seniority: 'Head',
                    departmentId: infraSecArea.id,
                    jobTitleId: headTitle.id,
                }
            }
        }
    });
    const headInfraProfileId = await getProfileId(headInfra.id);
    const supportLeader = await prisma.user.create({
        data: {
            email: 'lucy.support@enterprise.com',
            password,
            name: 'Lucy Support Lead',
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Support Leader',
                    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
                    birthday: new Date('1990-07-07'),
                    joinedAt: new Date('2022-04-15'),
                    seniority: 'Leader',
                    departmentId: supportTeam.id,
                    jobTitleId: supportLeaderTitle.id,
                    managerId: headInfraProfileId
                }
            }
        }
    });
    const supportLeaderProfileId = await getProfileId(supportLeader.id);
    await prisma.user.create({
        data: {
            email: 'intern@enterprise.com',
            password,
            name: 'Bob Intern',
            roles: { connect: { id: userRole.id } },
            profile: {
                create: {
                    bio: 'Support Intern',
                    birthday: new Date('2003-05-12'),
                    joinedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
                    seniority: 'Intern',
                    departmentId: supportTeam.id,
                    jobTitleId: internTitle.id,
                    managerId: supportLeaderProfileId
                }
            }
        }
    });
    console.log('📰 Seeding News...');
    const newsItems = [
        {
            title: "Fami Lança novo projeto de expansão",
            summary: "Hoje, 10/11, durante a nossa Reunião Geral, anunciamos os planos de expansão para o próximo triênio...",
            content: "<p>Hoje, 10/11, durante a nossa Reunião Geral, anunciamos os planos de expansão para o próximo triênio. O projeto visa dobrar a capacidade de atendimento...</p>",
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500",
            category: "Corporativo",
            publishDate: new Date('2025-11-10')
        },
        {
            title: "Assessores com Certificação CFP",
            summary: "Parabenizamos nossos novos assessores certificados! A qualificação contínua é nosso pilar...",
            content: "<p>Parabenizamos nossos novos assessores certificados! A qualificação contínua é nosso pilar para entregar excelência...</p>",
            image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=500",
            category: "RH",
            publishDate: new Date('2025-09-24')
        },
        {
            title: "Resultados do Terceiro Trimestre",
            summary: "Apresentamos crescimento de 25% no AUM. Confira o relatório completo na área de RI...",
            content: "<p>Apresentamos crescimento de 25% no AUM. Confira o relatório completo na área de RI. Os destaques ficaram para...</p>",
            image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=500",
            category: "Financeiro",
            publishDate: new Date('2025-10-15')
        },
        {
            title: "Inteligência Artificial na Saúde",
            summary: "Novo módulo de IA implementado para auxiliar diagnósticos precoces em nossas clínicas parceiras.",
            content: "<p>Novo módulo de IA implementado para auxiliar diagnósticos precoces. A tecnologia utiliza deep learning para...</p>",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500",
            category: "Tecnologia",
            publishDate: new Date('2025-10-18')
        },
        {
            title: "Programa de Bem-Estar 2026",
            summary: "Inscreva-se nas novas atividades de yoga, meditação e ginástica laboral disponíveis no app.",
            content: "<p>Inscreva-se nas novas atividades de yoga, meditação e ginástica laboral. O programa visa melhorar a qualidade de vida...</p>",
            image: "https://images.unsplash.com/photo-1544367563-12123d897573?auto=format&fit=crop&q=80&w=500",
            category: "Bem-estar",
            publishDate: new Date('2025-10-20')
        },
        {
            title: "Workshop de Cibersegurança",
            summary: "Proteja seus dados! Participe do treinamento obrigatório sobre phishing e segurança da informação.",
            content: "<p>Proteja seus dados! Participe do treinamento obrigatório sobre phishing. A segurança da informação é responsabilidade de todos...</p>",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500",
            category: "Segurança",
            publishDate: new Date('2025-10-25')
        }
    ];
    for (const item of newsItems) {
        await prisma.news.create({ data: item });
    }
    console.log('🏢 Seeding Company Settings...');
    await prisma.companySettings.create({
        data: {
            companyName: 'FAMI Capital',
            slogan: 'Excellence in Asset Management',
            primaryColor: '#1A2B4B',
            secondaryColor: '#BFA15F',
            email: 'contact@famicapital.com',
            website: 'www.famicapital.com'
        }
    });
    console.log('✅ Seed finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map