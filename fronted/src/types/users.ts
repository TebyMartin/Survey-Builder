export interface User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  role: "ADMIN" | "EDITOR" | "INTERVIEWER" | "VIEWER";

  isActive: boolean;

  lastLoginAt?: string;

  createdAt: string;
}
