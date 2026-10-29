import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

  const hashedPassword = await bcrypt.hash("Admin123*", 10);

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "System",
      email: "admin@surveybuilder.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
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
