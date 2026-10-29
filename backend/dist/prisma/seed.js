"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminExists = await prisma.user.findUnique({
        where: {
            email: "admin@surveybuilder.com",
        },
    });
    if (adminExists) {
        console.log("✅ El administrador ya existe.");
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash("Admin123*", 10);
    await prisma.user.create({
        data: {
            firstName: "Admin",
            lastName: "System",
            email: "admin@surveybuilder.com",
            password: hashedPassword,
            role: client_1.UserRole.ADMIN,
            organization: {
                create: {
                    name: "Survey Builder",
                    slug: "survey-builder",
                },
            },
        },
    });
    console.log("✅ Administrador creado correctamente.");
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
