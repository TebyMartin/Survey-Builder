// modules/users/service.ts

import bcrypt from "bcryptjs";
import { UsersRepository } from "./repository";

export class UsersService {
  repository = new UsersRepository();

  async findAll(organizationId: string) {
    return this.repository.findAll(organizationId);
  }

  async findById(id: string, organizationId: string) {
    return this.repository.findById(id, organizationId);
  }

  async create(data: any, organizationId: string) {
    if (data.role === "ADMIN") {
      throw new Error("No se pueden crear usuarios administradores");
    }
    const exists = await this.repository.findByEmail(data.email);

    if (exists) {
      throw new Error("El email ya existe.");
    }

    const password = await bcrypt.hash(data.password, 10);

    return this.repository.create(
      {
        ...data,
        password,
      },
      organizationId,
    );
  }

  async update(id: string, data: any, organizationId: string) {
    if (data.role === "ADMIN") {
      throw new Error("No se pueden asignar usuarios administradores");
    }

    if (
      data.password &&
      typeof data.password === "string" &&
      data.password.trim().length >= 6
    ) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    } else {
      delete data.password;
    }

    if (data.email) {
      const existing = await this.repository.findByEmail(data.email.trim());
      if (existing && existing.id !== id) {
        throw new Error("El email ya está en uso.");
      }
    }

    return this.repository.update(id, data, organizationId);
  }

  async delete(id: string, organizationId: string) {
    return this.repository.delete(id, organizationId);
  }

  async activate(id: string, organizationId: string) {
    return this.repository.activate(id, organizationId);
  }

  async desactivate(id: string, organizationId: string) {
    return this.repository.desactivate(id, organizationId);
  }
}
