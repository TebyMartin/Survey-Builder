import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrganizationRepository {
  async findAll() {
    return prisma.organization.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            users: true,
            surveys: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            surveys: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
    });
  }

  async create(data: { name: string; slug: string }) {
    return prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      isActive?: boolean;
    },
  ) {
    return prisma.organization.update({
      where: { id },
      data,
    });
  }

  async deactivate(id: string) {
    return prisma.organization.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async delete(id: string) {
    return prisma.organization.delete({
      where: { id },
    });
  }
}
