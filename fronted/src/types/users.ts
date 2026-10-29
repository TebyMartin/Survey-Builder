export interface User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  role: "ADMIN" | "EDITOR" | "INTERVIEWER" | "SUPERVISOR" | "VIEWER";

  isActive: boolean;

  lastLoginAt?: string;

  createdAt: string;
}
