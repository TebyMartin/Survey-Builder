import { UserRole } from "@prisma/client";

export interface AuthUser {
  organizationId: string;
  id: string;
  role: UserRole;
}
