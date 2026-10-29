export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "INTERVIEWER" | "SUPERVISOR" | "VIEWER";
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "EDITOR" | "INTERVIEWER" | "SUPERVISOR" | "VIEWER";
  isActive?: boolean;
}
