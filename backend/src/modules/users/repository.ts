import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UsersRepository {
  findAll(organizationId: string) {
    return prisma.user.findMany({
      where: {
        organizationId,
        role: {
          not: "ADMIN",
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  findById(id: string, organizationId: string) {
    return prisma.user.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  create(data: any, organizationId: string) {
    return prisma.user.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, data: any, organizationId: string) {
    await prisma.user.updateMany({
      where: {
        id,
        organizationId,
      },
      data,
    });
    return this.findById(id, organizationId);
  }

  desactivate(id: string, organizationId: string) {
    return prisma.user.updateMany({
      where: {
        id,
        organizationId,
      },
      data: {
        isActive: false,
      },
    });
  }

  activate(id: string, organizationId: string) {
    return prisma.user.updateMany({
      where: {
        id,
        organizationId,
      },
      data: {
        isActive: true,
      },
    });
  }

  async delete(id: string, organizationId: string) {
    return prisma.user.deleteMany({
      where: {
        id,
        organizationId,
      },
    });
  }
}
