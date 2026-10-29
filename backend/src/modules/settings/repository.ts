import { prisma } from "../../app";

export class SettingsRepository {
  async getOrganization(organizationId: string) {
    return prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
      },
    });
  }

  async updateOrganization(
    organizationId: string,
    data: {
      name?: string;
      logoUrl?: string | null;
      primaryColor?: string | null;
      secondaryColor?: string | null;
    },
  ) {
    return prisma.organization.update({
      where: {
        id: organizationId,
      },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
      },
    });
  }

  async getUser(userId: string, organizationId: string) {
    return prisma.user.findFirst({
      where: {
        id: userId,
        organizationId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async updateUser(
    userId: string,
    organizationId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
    },
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async updatePassword(userId: string, password: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }

  async getPassword(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
  }

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }
}
