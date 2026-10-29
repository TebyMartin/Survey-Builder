import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./repository";

export class AuthService {
  private repository = new AuthRepository();

  async login(email: string, password: string) {
    const user = await this.repository.findUserByEmail(email);
    console.log("Usuario encontrado:", user);

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new Error("Credenciales inválidas");
    }
    await this.repository.updateLastLogin(user.id);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
  }) {
    const exists = await this.repository.findUserByEmail(data.email);

    if (exists) {
      throw new Error("El email ya está registrado");
    }

    const password = await bcrypt.hash(data.password, 10);

    const slug = data.organizationName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const user = await this.repository.register({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password,
      organizationName: data.organizationName,
      organizationSlug: slug,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      },
    };
  }
  async me(userId: string) {
    const user = await this.repository.findUserById(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
    };
  }
}
